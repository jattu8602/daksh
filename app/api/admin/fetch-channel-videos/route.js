import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function POST(request) {
  try {
    const { channelUrl } = await request.json();
    if (!channelUrl) {
      return NextResponse.json({ error: 'Channel URL is required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    // Extract channel ID from URL
    let channelId;
    let username;

    // Clean the URL
    const cleanUrl = channelUrl.trim().replace(/\/$/, '');

    if (cleanUrl.includes('/channel/')) {
      // Direct channel ID format
      channelId = cleanUrl.split('/channel/')[1].split('/')[0].split('?')[0];
    } else if (cleanUrl.includes('/c/')) {
      // Custom URL format
      username = cleanUrl.split('/c/')[1].split('/')[0].split('?')[0];
    } else if (cleanUrl.includes('/@')) {
      // Handle format - extract the handle
      username = cleanUrl.split('/@')[1].split('/')[0].split('?')[0];
      // Remove any dots or special characters from the handle
      username = username.replace(/[^a-zA-Z0-9]/g, '');
    } else if (cleanUrl.startsWith('UC') && cleanUrl.length >= 24) {
      // Direct channel ID
      channelId = cleanUrl;
    } else {
      // Try as username
      username = cleanUrl;
    }

    // If we have a username, get the channel ID
    if (username) {
      try {
        // First try with the channels endpoint using the handle
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=id&forHandle=${username}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          channelId = data.items[0].id;
        } else {
          // If handle not found, try with the username
          const usernameResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=id&forUsername=${username}`
          );
          const usernameData = await usernameResponse.json();

          if (usernameData.items && usernameData.items.length > 0) {
            channelId = usernameData.items[0].id;
          } else {
            // If still not found, try searching for the channel
            const searchResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=${username}&type=channel&maxResults=1`
            );
            const searchData = await searchResponse.json();

            if (searchData.items && searchData.items.length > 0) {
              channelId = searchData.items[0].id.channelId;
            } else {
              return NextResponse.json({
                error: 'Could not find channel ID',
                details: 'The provided username or handle was not found'
              }, { status: 400 });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching channel ID:', error);
        return NextResponse.json({
          error: 'Failed to fetch channel ID',
          details: error.message
        }, { status: 500 });
      }
    }

    // Verify the channel exists
    try {
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=snippet&id=${channelId}`
      );
      const channelData = await channelResponse.json();

      if (!channelData.items || channelData.items.length === 0) {
        return NextResponse.json({
          error: 'Channel not found',
          details: 'The provided channel ID is invalid or the channel does not exist'
        }, { status: 404 });
      }

      // Fetch ALL channel videos with pagination
      let allVideos = [];
      let nextPageToken = null;
      let pageCount = 0;
      const maxRetries = 3;

      do {
        try {
          // Fetch videos page by page
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
          );

          const data = await response.json();
          if (!data.items) {
            break;
          }

          // Get video IDs for batch processing
          const videoIds = data.items
            .filter(item => item.id.kind === 'youtube#video')
            .map(item => item.id.videoId);

          if (videoIds.length > 0) {
            // Fetch video details in batch
            const videoResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails,snippet,status&id=${videoIds.join(',')}`
            );
            const videoData = await videoResponse.json();

            if (videoData.items) {
              // Process videos and check for shorts
              const processedVideos = videoData.items.map(video => {
                // Skip if video is not available
                if (video.status?.privacyStatus !== 'public') {
                  return null;
                }

                // Check if it's a shorts video using multiple criteria
                const duration = video.contentDetails.duration;
                const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                const hours = (match[1] && parseInt(match[1])) || 0;
                const minutes = (match[2] && parseInt(match[2])) || 0;
                const seconds = (match[3] && parseInt(match[3])) || 0;
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;

                // Check for shorts indicators
                const title = video.snippet.title.toLowerCase();
                const description = video.snippet.description.toLowerCase();
                const isShorts =
                  totalSeconds <= 60 || // Duration check
                  title.includes('#shorts') || // Title check
                  description.includes('#shorts') || // Description check
                  title.includes('short') || // Additional title checks
                  title.includes('shorts') ||
                  /^shorts?$/i.test(title) || // Exact match for "short" or "shorts"
                  /^#shorts?$/i.test(title) || // Exact match for "#short" or "#shorts"
                  video.snippet.tags?.some(tag =>
                    tag.toLowerCase().includes('shorts') ||
                    tag.toLowerCase().includes('short')
                  ); // Tags check

                if (isShorts) {
                  return {
                    url: `https://www.youtube.com/watch?v=${video.id}`,
                    title: video.snippet.title,
                    description: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.high.url,
                    publishedAt: video.snippet.publishedAt,
                    duration: totalSeconds,
                    isShorts: true
                  };
                }
                return null;
              });

              const validVideos = processedVideos.filter(video => video !== null);
              allVideos = [...allVideos, ...validVideos];

              console.log(`Processed page ${pageCount + 1}, found ${validVideos.length} shorts in this page`);
            }
          }

          nextPageToken = data.nextPageToken;
          pageCount++;

          // Add a small delay to avoid hitting rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`Error processing page ${pageCount + 1}:`, error);
          // Retry logic
          let retryCount = 0;
          while (retryCount < maxRetries) {
            try {
              await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
              // Retry the same page
              continue;
            } catch (retryError) {
              retryCount++;
              if (retryCount === maxRetries) {
                console.error('Max retries reached, moving to next page');
                break;
              }
            }
          }
        }
      } while (nextPageToken);

      // Sort videos by publish date (newest first)
      allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      return NextResponse.json({
        success: true,
        videos: allVideos,
        channelId,
        channelTitle: channelData.items[0].snippet.title,
        totalVideos: allVideos.length,
        pagesProcessed: pageCount
      });
    } catch (error) {
      console.error('Error fetching channel data:', error);
      return NextResponse.json({
        error: 'Failed to fetch channel data',
        details: error.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in channel video fetch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel videos', details: error.message },
      { status: 500 }
    );
  }
}