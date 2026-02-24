const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

const messageController = {
    send: async (req, res) => {
        try {
            const { contenu, content, recipientId, groupId } = req.body;
            const id_expediteur = req.user.userId;

            console.log('✉️ Sending message request:', {
                messageText: contenu || content,
                recipientId,
                groupId,
                hasFile: !!req.file
            });

            // Clean IDs: convert empty strings to null
            const cleanRecipientId = recipientId && recipientId !== '' ? recipientId : null;
            const cleanGroupId = groupId && groupId !== '' ? groupId : null;
            const messageText = contenu || content;

            let image_url = null;
            if (req.file) {
                console.log('📁 Image uploaded:', req.file.filename);
                const protocol = req.get('x-forwarded-proto') || req.protocol;
                const host = req.get('host');
                image_url = `${protocol}://${host}/uploads/${req.file.filename}`;
                console.log('🔗 Generated URL:', image_url);
            }

            if (!messageText && !image_url) {
                return res.status(400).json({ success: false, message: 'Content or image required' });
            }

            if (!cleanRecipientId && !cleanGroupId) {
                return res.status(400).json({ success: false, message: 'Recipient or group required' });
            }

            const id = await Message.create({
                contenu: messageText || '',
                id_expediteur,
                id_destinataire: cleanRecipientId,
                id_groupe: cleanGroupId,
                image_url
            });

            // Trigger Notification for Direct Message
            if (cleanRecipientId) {
                try {
                    const sender = await User.findById(id_expediteur);
                    await Notification.create({
                        id_user: cleanRecipientId,
                        type: 'MESSAGE',
                        contenu: `Nouveau message de ${sender.prenom} ${sender.nom}`,
                        lien: '/dashboard/messages'
                    });
                } catch (notifErr) {
                    console.error('⚠️ Notification failed but message sent:', notifErr.message);
                }
            }

            res.status(201).json({ success: true, message: 'Message sent', id, image_url });
        } catch (error) {
            console.error('❌ Error in messageController.send:', error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getConversation: async (req, res) => {
        try {
            const userId = req.user.userId;
            const otherId = req.params.userId;
            const isGroup = req.query.isGroup === 'true';

            let messages;
            if (isGroup) {
                messages = await Message.getGroupMessages(otherId);
            } else {
                messages = await Message.getConversation(userId, otherId);
            }
            res.json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getRecent: async (req, res) => {
        try {
            // Simplified: Gets all messages where user is involved
            // In a real app, you'd group by conversation
            const messages = await Message.getUserConversations(req.user.userId);
            res.json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = messageController;
