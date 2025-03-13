const axios = require('axios');
const { pinterest } = require('../start/lib/function/pin');

/*let handler = async (m, { client, text, q, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} Kucing`);
    await reaction(m.chat, "🔍");

    try {
        const response = await pinterest.search(text, 5);

        if (!response.status || !Array.isArray(response.result.pins) || response.result.pins.length === 0) {
            return reply("Tidak ada hasil yang ditemukan.");
        }

        let cards = response.result.pins.map(item => ({
            image: { url: item.media.images.orig.url },
            title: item.title || "Gambar Pinterest",
            caption: "Klik tombol untuk melihat lebih lanjut.",
            footer: "Powered by Bot",
            buttons: [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Lihat di Pinterest",
                        id: item.pin_url
                    })
                }
            ]
        }));

        await client.sendMessage(
            m.chat,
            {
                text: `🔍 Hasil pencarian untuk: *${text}*`,
                footer: "Pilih salah satu gambar di bawah:",
                cards: cards.slice(0, 5) // Batasi jumlah hasil agar tidak terlalu banyak
            },
            { quoted: m }
        );

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat mengambil data.");
    }
}*/

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} Kucing`);
    await reaction(m.chat, "🔍");

    try {
        const response = await pinterest.search(text, 5);

        if (!response.status || !Array.isArray(response.result.pins) || response.result.pins.length === 0) {
            return reply("Tidak ada hasil yang ditemukan.");
        }

        for (let item of response.result.pins) {
            await client.sendMessage(m.chat, {
                image: { url: item.media.images.orig.url }, // Kirim gambar langsung
                caption: `📌 *Pinterest Search:* ${text}\n🔗 *Sumber:* [Klik Disini](${item.pin_url})`
            }, { quoted: m });

            // Delay agar tidak spam
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 detik jeda
        }

    } catch (error) {
        console.error(error);
        reply("Terjadi kesalahan saat mengambil data.");
    }
}

handler.help = ['pinterest search'];
handler.tags = ['downloader'];
handler.command = ["pin"];

module.exports = handler;
