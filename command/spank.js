const axios = require('axios');
const { spankbangs } = require('../start/lib/function/spank');

let handler = async (m, { client, q1, q2, reply, reaction, prefix, command }) => {
    if (!q1) return reply(`\n*ex:* ${prefix + command} colmek\n`);
    await reaction(m.chat, "⚡");

    try {
        const url = `https://spankbang.com/s/${q1}/`; // Pastikan domain valid
        const response = await spankbangs(url);

        if (!Array.isArray(response) || response.length === 0) {
            return reply("Tidak ada hasil yang ditemukan.");
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function ensureMinimumResults(response, minResults = q2) {
            let shuffledResponse = [...response];
            shuffleArray(shuffledResponse);

            while (shuffledResponse.length < minResults) {
                shuffledResponse = [...shuffledResponse, ...response];
            }

            return shuffledResponse.slice(0, minResults);
        }

        let shuffledResults = ensureMinimumResults(response, q2);
        let cards = shuffledResults.map(item => ({
                image: { url: item.imgSrc }, // Gunakan gambar hasil scraping
                title: item.title,
                caption: "Klik tombol untuk menonton video.",
                footer: "Powered by Bot",
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Tonton Sekarang",
                            id: `.porn ${item.link}` // Bisa pakai ID unik
                        })
                    }
                ]
            }));

            await client.sendMessage(
            m.chat,
            {
                text: `🔍 Hasil pencarian untuk: *${q1}*`,
                footer: "Pilih salah satu video di bawah:",
                cards: cards.slice(0, q2) // Kirim maksimal 5 cards biar gak kebanyakan
            },
            { quoted: m }
        );

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat mengambil data.");
    }
}

handler.help = ['spankbang search'];
handler.tags = ['downloader'];
handler.command = ["spank"];

module.exports = handler;
