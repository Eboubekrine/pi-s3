const Candidature = require('../models/Candidature');
const Notification = require('../models/Notification');
const db = require('../config/database');

const candidatureController = {
    apply: async (req, res) => {
        try {
            const { id_offre, message } = req.body;
            const id_user = req.user.userId;

            if (!id_offre) {
                return res.status(400).json({ success: false, message: 'id_offre is required' });
            }

            const alreadyApplied = await Candidature.checkExisting(id_user, id_offre);
            if (alreadyApplied) {
                return res.status(400).json({ success: false, message: 'Vous avez déjà postulé à cette offre' });
            }

            // cv_url: use uploaded file URL if available, otherwise null
            let cv_url = null;
            if (req.file) {
                cv_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            const id = await Candidature.create({
                id_offre,
                id_user,
                cv_url,
                message
            });

            res.status(201).json({
                success: true,
                message: 'Candidature soumise avec succès',
                id_candidature: id
            });
        } catch (error) {
            console.error('Apply error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUserApplications: async (req, res) => {
        try {
            const candidatures = await Candidature.findByUser(req.user.userId);
            res.json({ success: true, data: candidatures });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getOffreApplications: async (req, res) => {
        try {
            // Only admin or the creator of the offer should see this (logic could be refined)
            const candidatures = await Candidature.findByOffre(req.params.offreId);
            res.json({ success: true, data: candidatures });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { statut } = req.body;
            const updated = await Candidature.updateStatut(req.params.id, statut);
            if (updated) {
                // Get application details to find the user
                const [rows] = await db.execute(`
                    SELECT c.id_user, o.titre, o.entreprise 
                    FROM candidature c 
                    JOIN offre o ON c.id_offre = o.id_offre 
                    WHERE c.id_candidature = ?
                `, [req.params.id]);

                if (rows.length > 0) {
                    const app = rows[0];
                    await Notification.create({
                        id_user: app.id_user,
                        type: 'APPLICATION',
                        contenu: `Votre candidature pour "${app.titre}" chez ${app.entreprise} a été mise à jour : ${statut}.`,
                        lien: '/dashboard/applications'
                    });
                }

                res.json({ success: true, message: 'Status updated' });
            } else {
                res.status(404).json({ success: false, message: 'Application not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = candidatureController;
