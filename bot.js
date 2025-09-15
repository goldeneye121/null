const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR code di atas dengan WhatsApp kamu!');
});

client.on('ready', () => {
    console.log('Bot WhatsApp sudah siap!');
});

client.on('message', async (msg) => {
    // Cek jika pesan dikirim di grup
    if (msg.from.includes('@g.us')) {
        const chat = await msg.getChat();
        
        // Perintah .kick
        if (msg.body.startsWith('.kick')) {
            // Pastikan pengirim adalah admin
            const sender = await msg.getContact();
            const group = await chat;
            const isSenderAdmin = group.participants.find(p => p.id._serialized === sender.id._serialized)?.isAdmin;

            if (!isSenderAdmin) {
                await msg.reply('Maaf, hanya admin grup yang bisa menggunakan perintah .kick!');
                return;
            }

            // Ambil nomor yang ditandai
            const mentionedIds = msg.mentionedIds;
            if (mentionedIds.length === 0) {
                await msg.reply('Silakan tag orang yang ingin di-kick, contoh: .kick @nomor');
                return;
            }

            // Coba kick setiap orang yang ditandai
            for (const userId of mentionedIds) {
                try {
                    await chat.removeParticipants([userId]);
                    await msg.reply(`Berhasil mengeluarkan ${userId.split('@')[0]} dari grup!`);
                } catch (error) {
                    await msg.reply(`Gagal mengeluarkan ${userId.split('@')[0]}. Pastikan bot memiliki izin admin!`);
                    console.error('Error saat kick:', error);
                }
            }
        }
    }

    // Fitur sebelumnya (respons halo)
    if (msg.body.toLowerCase() === 'halo') {
        await msg.reply('Halo bro, apa kabar?');
    }
});

client.initialize();
