const axios = require('axios');
const cheerio = require('cheerio');

async function fetchVideoSrc(videoUrl) {
    const baseUrl = 'https://dirpy.com/studio';
    
    if (!videoUrl) {
        throw new Error('Video URL is required');
    }
    
    try {
        const fullUrl = `${baseUrl}?url=${encodeURIComponent(videoUrl)}&affid=spankbangdownloader&utm_source=spankbangdownloader&utm_medium=download`;
        const { data } = await axios.get(fullUrl);
        
        const $ = cheerio.load(data);
        const videoSrc = $('video source').attr('src');
        
        return videoSrc || null;
    } catch (error) {
        console.error('Error fetching video source:', error.message);
        return null;
    }
}

module.exports = { fetchVideoSrc };
