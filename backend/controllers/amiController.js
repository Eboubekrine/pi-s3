const db = require('../config/database');
const Ami = require('../models/Ami');
const Notification = require('../models/Notification');
const User = require('../models/User');


const amiController = {
    sendRequest: async (req, res) => {
        try {
            const id_demandeur = req.user.userId;
            const id_receveur = req.params.userId;

            if (id_demandeur == id_receveur) {
                return res.status(400).json({ message: 'Cannot friend yourself' });
            }

            const existing = await Ami.checkStatus(id_demandeur, id_receveur);
            if (existing) {
                return res.status(400).json({ message: 'Request already exists or friends' });
            }

            await Ami.create(id_demandeur, id_receveur);

            const sender = await User.findById(id_demandeur);
            await Notification.create({
                id_user: id_receveur,
                type: 'FRIEND_REQUEST',
                contenu: `${sender.prenom} ${sender.nom} vous a envoyé une demande d'ami.`,
                lien: '/dashboard/search'
            });

            res.json({ success: true, message: 'Friend request sent' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    acceptRequest: async (req, res) => {
        try {
            const targetId = req.params.userId;
            const relation = await Ami.checkStatus(req.user.userId, targetId);

            if (!relation) return res.status(404).json({ message: 'Request not found' });

            // Only receiver can accept
            if (relation.id_receveur !== req.user.userId) {
                return res.status(403).json({ message: 'Only receiver can accept' });
            }

            await Ami.updateStatus(relation.id_relation, 'ACCEPTE');

            const acceptor = await User.findById(req.user.userId);
            await Notification.create({
                id_user: targetId,
                type: 'FRIEND_REQUEST',
                contenu: `${acceptor.prenom} ${acceptor.nom} a accepté votre demande d'ami.`,
                lien: '/dashboard/search'
            });

            res.json({ success: true, message: 'Request accepted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    removeFriend: async (req, res) => {
        try {
            await Ami.deleteByUsers(req.user.userId, req.params.userId);
            res.json({ success: true, message: 'Removed successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getFriends: async (req, res) => {
        try {
            const friends = await Ami.findByUser(req.user.userId);
            res.json({ success: true, friends });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getRequests: async (req, res) => {
        try {
            const requests = await Ami.findRequests(req.user.userId);
            res.json({ success: true, requests });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    respondRequest: async (req, res) => {
        try {
            const { id_relation, status } = req.body; // status: 'ACCEPTE' or 'REFUSE'
            await Ami.updateStatus(id_relation, status);
            res.json({ success: true, message: `Request ${status}` });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    checkFriendship: async (req, res) => {
        try {
            const status = await Ami.checkStatus(req.user.userId, req.params.userId);
            res.json({ success: true, status });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = amiController;
