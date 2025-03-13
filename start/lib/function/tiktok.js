// tiktokFetcher.js - Module untuk fetch video TikTok (CommonJS)

async function apa(url) {
    try {
      const response = await fetch(`https://fgsi1-tiktok.hf.space/?url=${encodeURIComponent(url)}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.data) {
        throw new Error('Data tidak ditemukan dalam respons API');
      }
  
      const apa = data.data;
      return {
        judul: apa.desc,
        author: apa.author.nickname,
        video: apa.video.play_addr.url_list[0]
      };
    } catch (error) {
      throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
  }
  
  // Ekspor fungsi agar bisa digunakan di file lain (CommonJS)
module.exports = { apa };
  