const axios = require('axios');
const cheerio = require('cheerio');

async function spankbangs(url) {
    try {
        const mentah = `https://api.allorigins.win/raw?url=${url}`
        const { data } = await axios.get(mentah);
        const $ = cheerio.load(data);
        const results = [];

        $('.video-item').each((index, element) => {
            const title = $(element).find('a.thumb').attr('title');
            const href = $(element).find('a.thumb').attr('href');
            const link = `https://spankbang.com${href}`;
            const imgSrc = $(element).find('img').attr('data-src');
            const previewVideo = $(element).find('img').attr('data-preview');

            results.push({ title, link, imgSrc, previewVideo });
        });

        return results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

module.exports = { spankbangs };
