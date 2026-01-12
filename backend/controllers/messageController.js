const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

const messageController = {
    send: async (req, res) => {
        try {
            const { contenu, content, recipientId, groupId } = req.body;
            const id_expediteur = req.user.userId;

            const messageText = contenu || content;

            let image_url = null;
            if (req.file) {
                image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            if (!messageText && !image_url) {
                return res.status(400).json({ message: 'Content or image required' });
            }

            if (!recipientId && !groupId) {
                return res.status(400).json({ message: 'Recipient or group required' });
            }

            const id = await Message.create({
                contenu: messageText || '',
                id_expediteur,
                id_destinataire: recipientId || null,
                id_groupe: groupId || null,
                image_url
            });

            // Trigger Notification for Direct Message
            if (recipientId) {
                const sender = await User.findById(id_expediteur);
                await Notification.create({
                    id_user: recipientId,
                    type: 'MESSAGE',
                    contenu: `Nouveau message de ${sender.prenom} ${sender.nom}`,
                    lien: '/dashboard/messages'
                });
            }

            res.status(201).json({ success: true, message: 'Message sent', id, image_url });
        } catch (error) {
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
