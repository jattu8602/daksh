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

      // Fetch channel videos
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&type=video`
      );

      const data = await response.json();
      if (!data.items) {
        return NextResponse.json({ error: 'Failed to fetch channel videos' }, { status: 500 });
      }

      // Filter for shorts videos and format them
      const videos = await Promise.all(
        data.items
          .filter(item => item.id.kind === 'youtube#video')
          .map(async item => {
            try {
              // Get video details to check duration
              const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails&id=${item.id.videoId}`
              );
              const videoData = await videoResponse.json();

              if (!videoData.items || videoData.items.length === 0) return null;

              // Check if it's a shorts video (duration <= 60 seconds)
              const duration = videoData.items[0].contentDetails.duration;
              const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
              const hours = (match[1] && parseInt(match[1])) || 0;
              const minutes = (match[2] && parseInt(match[2])) || 0;
              const seconds = (match[3] && parseInt(match[3])) || 0;
              const totalSeconds = hours * 3600 + minutes * 60 + seconds;

              if (totalSeconds <= 60) {
                return {
                  url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                  title: item.snippet.title,
                  description: item.snippet.description,
                  thumbnail: item.snippet.thumbnails.high.url,
                  publishedAt: item.snippet.publishedAt,
                  duration: totalSeconds
                };
              }
              return null;
            } catch (error) {
              console.error('Error fetching video details:', error);
              return null;
            }
          })
      );

      // Filter out null values (non-shorts videos)
      const shortsVideos = videos.filter(video => video !== null);

      return NextResponse.json({
        success: true,
        videos: shortsVideos,
        channelId,
        channelTitle: channelData.items[0].snippet.title
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