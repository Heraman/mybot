const SnapInst = require('../start/lib/function/ig');
const axios = require('axios');

async function loadFileType() {
    return await import('file-type');
}

async function getFileType(buffer) {
    const fileType = await loadFileType();
    return await fileType.fileTypeFromBuffer(buffer);
}

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} https://www.instagram.com/reel/DB8BGCZRKAh/?igsh=eDk1ajRncDV6Mjdh\n`);

    let result = await SnapInst.app(text);
    const cap = result.username;
    await reaction(m.chat, "⚡");

    let cards = [];

    for (let item of result.urls) {
        try {
            // Ambil buffer data untuk menentukan jenis file
            const response = await axios.get(item, { responseType: 'arraybuffer' });
            const fileTypeResult = await getFileType(response.data);

            if (fileTypeResult) {
                let mime = fileTypeResult.mime;

                if (mime.startsWith('image')) {
                    await client.sendMessage(m.chat, {
                        image: { url: item },
                    }, { quoted: m });
                    /*cards.push({
                        image: { url: item },
                        title: `📸 ${cap}`,
                        caption: "Klik tombol agar bot mengirim gambar nya",
                        footer: "JilpaGG",
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Kirim Gambar",
                                    id: `.g ${text}`
                                })
                            }
                        ]
                    });*/
                } else if (mime.startsWith('video')) {
                    // Jika video, langsung kirim sebagai media terpisah
                    await client.sendMessage(m.chat, {
                        video: { url: item },
                        caption: `📸 ${cap}`
                    }, { quoted: m });
                }
            } else {
                reply(`Gagal mendeteksi format file.`);
            }
        } catch (error) {
            console.error("Error fetching media:", error);
            reply(`Gagal mengunduh media: ${item}`);
        }
    }

    if (cards.length > 0) {
        await client.sendMessage(
            m.chat,
            {
                text: `🔍 Hasil download untuk: *${cap}*`,
                footer: "Pilih salah satu gambar di bawah:",
                cards: cards
            },
            { quoted: m }
        );
    }
};

handler.help = ['downloader instagram'];
handler.tags = ['downloader'];
handler.command = ["ig"];

module.exports = handler;
