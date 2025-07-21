import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { playlistUrl } = await request.json()
    if (!playlistUrl) {
      return NextResponse.json(
        { error: 'Playlist URL is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      )
    }

    // Extract playlist ID from URL
    let playlistId = null
    const urlMatch = playlistUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/)
    if (urlMatch && urlMatch[1]) {
      playlistId = urlMatch[1]
    } else if (/^PL|^UU|^LL|^FL/.test(playlistUrl)) {
      // Direct playlist ID
      playlistId = playlistUrl
    }

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Invalid playlist URL or ID' },
        { status: 400 }
      )
    }

    // Fetch playlist details
    let playlistTitle = ''
    try {
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&id=${playlistId}&part=snippet`
      )
      const playlistData = await playlistRes.json()
      if (playlistData.items && playlistData.items.length > 0) {
        playlistTitle = playlistData.items[0].snippet.title
      }
    } catch (e) {
      // Ignore, fallback to empty title
    }

    // Fetch ALL playlist videos with pagination
    let allVideos = []
    let nextPageToken = null
    let pageCount = 0
    const maxRetries = 3

    do {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
        )
        const data = await response.json()
        if (!data.items) break

        // Get video IDs for batch processing
        const videoIds = data.items
          .map((item) => item.contentDetails.videoId)
          .filter(Boolean)

        if (videoIds.length > 0) {
          // Fetch video details in batch
          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails,snippet,status&id=${videoIds.join(',')}`
          )
          const videoData = await videoResponse.json()

          if (videoData.items) {
            const processedVideos = videoData.items.map((video) => {
              if (video.status?.privacyStatus !== 'public') return null
              const duration = video.contentDetails.duration
              const match = duration.match(
                /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
              )
              const hours = (match && match[1] && parseInt(match[1])) || 0
              const minutes = (match && match[2] && parseInt(match[2])) || 0
              const seconds = (match && match[3] && parseInt(match[3])) || 0
              const totalSeconds = hours * 3600 + minutes * 60 + seconds
              return {
                url: `https://www.youtube.com/watch?v=${video.id}`,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails?.high?.url || '',
                publishedAt: video.snippet.publishedAt,
                duration: totalSeconds,
                isShorts: totalSeconds <= 60,
              }
            })
            const validVideos = processedVideos.filter((v) => v !== null)
            allVideos = [...allVideos, ...validVideos]
          }
        }
        nextPageToken = data.nextPageToken
        pageCount++
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        // Retry logic
        let retryCount = 0
        while (retryCount < maxRetries) {
          try {
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * (retryCount + 1))
            )
            continue
          } catch (retryError) {
            retryCount++
            if (retryCount === maxRetries) break
          }
        }
      }
    } while (nextPageToken)

    // Sort videos by publish date (newest first)
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

    return NextResponse.json({
      success: true,
      videos: allVideos,
      playlistId,
      playlistTitle,
      totalVideos: allVideos.length,
      pagesProcessed: pageCount,
    })
  } catch (error) {
    console.error('Error in playlist video fetch:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playlist videos', details: error.message },
      { status: 500 }
    )
  }
}
