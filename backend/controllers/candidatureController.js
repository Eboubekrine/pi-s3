const Candidature = require('../models/Candidature');
const Notification = require('../models/Notification');
const db = require('../config/database');

const candidatureController = {
    apply: async (req, res) => {
        try {
            const id_offre = parseInt(req.body.id_offre); // Ensure it's a number
            const message = req.body.message;
            const id_user = req.user.userId;

            if (!id_offre || isNaN(id_offre)) {
                return res.status(400).json({ success: false, message: 'id_offre invalide ou manquant' });
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
                message: message || null
            });

            res.status(201).json({
                success: true,
                message: 'Candidature soumise avec succès',
                id_candidature: id
            });
        } catch (error) {
            console.error('Apply error:', error);
            // Return the REAL error message so we can debug it
            res.status(500).json({ success: false, message: error.message, sqlMessage: error.sqlMessage || null });
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
            const { offreId } = req.params;

            // Ownership/Admin check
            const [offre] = await db.execute('SELECT id_user FROM offre WHERE id_offre = ?', [offreId]);
            if (offre.length === 0) return res.status(404).json({ message: 'Offre non trouvée' });

            if (req.user.role !== 'ADMIN' && offre[0].id_user !== req.user.userId) {
                return res.status(403).json({ success: false, message: 'Accès refusé' });
            }

            const candidatures = await Candidature.findByOffre(offreId);
            res.json({ success: true, data: candidatures });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { statut } = req.body;

            // Ownership/Admin check
            const [rows] = await db.execute(`
                SELECT c.id_user as applicant_id, o.id_user as owner_id, o.titre, o.entreprise 
                FROM candidature c 
                JOIN offre o ON c.id_offre = o.id_offre 
                WHERE c.id_candidature = ?
            `, [id]);

            if (rows.length === 0) return res.status(404).json({ success: false, message: 'Candidature non trouvée' });

            if (req.user.role !== 'ADMIN' && rows[0].owner_id !== req.user.userId) {
                return res.status(403).json({ success: false, message: 'Accès refusé' });
            }

            const updated = await Candidature.updateStatut(id, statut);
            if (updated) {
                const app = rows[0];
                await Notification.create({
                    id_user: app.applicant_id,
                    type: 'APPLICATION',
                    contenu: `Votre candidature pour "${app.titre}" chez ${app.entreprise} a été mise à jour : ${statut}.`,
                    lien: '/dashboard/applications'
                });

                res.json({ success: true, message: 'Statut mis à jour' });
            } else {
                res.status(404).json({ success: false, message: 'Candidature non trouvée' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = candidatureController;
