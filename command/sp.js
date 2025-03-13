const sp = require('../start/lib/function/sp');

let handler = async (m, { client, text, q1, q2, reply, reaction, prefix, command }) => {
	if (!q1) return reply(`\n*ex:* ${prefix + command} 5\n`);
    await reaction(m.chat, "⚡");
    
    const data = await sp(text)
    let card = data.map(item => ({
        image: { url: item.image },
        title: item.title,
        caption: "Klik tombol untuk menonton video.",
        footer: "Powered by Bot",
        buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Tonton Sekarang",
                            id: `.porn ${item.href}` // Bisa pakai ID unik
                        })
                    }
                ]
    }));
    await client.sendMessage(
            m.chat,
            {
                text: `🔍 Hasil pencarian untuk: *${q1}*`,
                footer: "Pilih salah satu video di bawah:",
                cards: card.slice(0, q2) // Kirim maksimal 5 cards biar gak kebanyakan
            },
            { quoted: m }
        );
}

handler.help = ['spankbang search'];
handler.tags = ['search'];
handler.command = ["sp"];

module.exports = handler;

