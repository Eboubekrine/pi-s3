const db = require('../config/database');

const Partenaire = {
    create: async (data) => {
        const { nom, secteur, ville, site_web, logo } = data;
        const [result] = await db.execute(
            'INSERT INTO partenaire (nom, secteur, ville, site_web, logo) VALUES (?, ?, ?, ?, ?)',
            [nom, secteur, ville, site_web, logo]
        );
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM partenaire ORDER BY date_ajout DESC');
        return rows;
    },

    update: async (id, data) => {
        const { nom, secteur, ville, site_web, logo } = data;
        const [result] = await db.execute(
            'UPDATE partenaire SET nom=?, secteur=?, ville=?, site_web=?, logo=? WHERE id_partenaire=?',
            [nom, secteur, ville, site_web, logo, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM partenaire WHERE id_partenaire=?', [id]);
        return result.affectedRows > 0;
    }
};

const partenaireController = {
    getAll: async (req, res) => {
        try {
            const partners = await Partenaire.findAll();
            res.json({ success: true, data: partners });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const id = await Partenaire.create(req.body);
            res.status(201).json({ success: true, message: 'Partner created', id });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const success = await Partenaire.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ message: 'Partner not found' });
            res.json({ success: true, message: 'Partner updated' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const success = await Partenaire.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Partner not found' });
            res.json({ success: true, message: 'Partner deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = partenaireController;
