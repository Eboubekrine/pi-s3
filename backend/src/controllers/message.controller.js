const Message = require('../models/message.model');

class MessageController {

    // Envoyer un message
    static async sendMessage(req, res) {
        try {
            const { recipientId, content } = req.body;
            const senderId = req.user.id;

            const messageId = await Message.create({ senderId, recipientId, content });

            res.status(201).json({
                success: true,
                message: 'Message envoyé',
                data: { id: messageId }
            });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // Obtenir les messages d’un utilisateur
    static async getUserMessages(req, res) {
        try {
            const userId = req.user.id;
            const messages = await Message.getByUserId(userId);
            res.json({ success: true, data: messages });
        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // Obtenir un message par ID
    static async getMessageById(req, res) {
        try {
            const messageId = req.params.id;
            const message = await Message.findById(messageId);
            if (!message) return res.status(404).json({ success: false, message: 'Message non trouvé' });
            res.json({ success: true, data: message });
        } catch (error) {
            console.error('Get message by id error:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // Supprimer un message
    static async deleteMessage(req, res) {
        try {
            const messageId = req.params.id;
            const deleted = await Message.delete(messageId);
            if (!deleted) return res.status(404).json({ success: false, message: 'Message non trouvé' });
            res.json({ success: true, message: 'Message supprimé' });
        } catch (error) {
            console.error('Delete message error:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // Marquer un message comme lu
    static async markAsRead(req, res) {
        try {
            const messageId = req.params.id;
            const updated = await Message.markAsRead(messageId);
            if (!updated) return res.status(404).json({ success: false, message: 'Message non trouvé' });
            res.json({ success: true, message: 'Message marqué comme lu' });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // Obtenir la conversation avec un autre utilisateur
    static async getConversation(req, res) {
        try {
            const userId1 = req.user.id;
            const userId2 = req.params.userId;
            const conversation = await Message.getConversation(userId1, userId2);
            res.json({ success: true, data: conversation });
        } catch (error) {
            console.error('Get conversation error:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
}

module.exports = MessageController;
