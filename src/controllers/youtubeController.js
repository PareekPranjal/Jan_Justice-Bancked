// In-memory cache
let cachedVideos = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const CHANNEL_HANDLE = 'half-civil-judge';

// @desc    Get latest YouTube videos from channel RSS feed
// @route   GET /api/youtube/latest
// @access  Public
export const getLatestVideos = async (req, res) => {
  try {
    // Return cache if fresh
    if (cachedVideos && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return res.status(200).json({ success: true, data: cachedVideos });
    }

    // Step 1: Resolve channel ID from handle
    const channelPageRes = await fetch(`https://www.youtube.com/@${CHANNEL_HANDLE}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LegalHubBot/1.0)',
      },
    });
    const html = await channelPageRes.text();

    // Extract channel ID from meta tag or page content
    const channelIdMatch = html.match(/\"channelId\":\"(UC[a-zA-Z0-9_-]+)\"/) ||
      html.match(/channel_id=(UC[a-zA-Z0-9_-]+)/) ||
      html.match(/\"externalId\":\"(UC[a-zA-Z0-9_-]+)\"/);

    if (!channelIdMatch) {
      return res.status(500).json({
        success: false,
        message: 'Could not resolve channel ID',
      });
    }

    const channelId = channelIdMatch[1];

    // Step 2: Fetch RSS feed
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const feedRes = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LegalHubBot/1.0)',
      },
    });
    const feedXml = await feedRes.text();

    // Step 3: Parse XML entries (simple regex parsing, no xml library needed)
    const entries = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(feedXml)) !== null && entries.length < 6) {
      const entry = match[1];

      const videoId = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
      const title = (entry.match(/<title>([^<]+)<\/title>/) || [])[1];
      const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1];
      const viewCount = (entry.match(/<media:statistics views="(\d+)"/) || [])[1];

      if (videoId && title) {
        entries.push({
          videoId,
          title: decodeXmlEntities(title),
          published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          thumbnailHigh: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          views: viewCount ? parseInt(viewCount) : null,
        });
      }
    }

    // Cache result
    cachedVideos = { channelId, videos: entries };
    cacheTimestamp = Date.now();

    res.status(200).json({ success: true, data: cachedVideos });
  } catch (error) {
    // Return cache even if stale on error
    if (cachedVideos) {
      return res.status(200).json({ success: true, data: cachedVideos });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch YouTube videos',
      error: error.message,
    });
  }
};

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
