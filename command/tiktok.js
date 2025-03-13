const { apa } = require('../start/lib/function/tiktok'); // Pastikan path benar

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} https://vt.tiktok.com/ZS6ThFced/\n`);

    try {
        await reaction(m.chat, "⚡");
        let res = await apa(text);
        if (!res.video) return reply("Gagal mendapatkan video TikTok!");

        let message = `🎥 *Judul:* ${res.judul}\n👤 *Author:* ${res.author}`;
        await client.sendMessage(m.chat, {
            video: { url: res.video },
            caption: message
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        await reply("Terjadi kesalahan saat memproses permintaan.");
    }
};

handler.help = ['downloader tiktok'];
handler.tags = ['downloader'];
handler.command = ["tiktok"];

module.exports = handler;
