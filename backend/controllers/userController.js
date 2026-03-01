const User = require('../models/User');
const Alumni = require('../models/Alumni');

const userController = {
    getAll: async (req, res) => {
        try {
            console.log('📥 GET /users called');
            console.log('   User:', req.user);

            const users = await User.findAll();
            console.log(`   Found ${users.length} users in database`);

            // Map users to remove passwords
            const safeUsers = users.map(u => {
                const { mot_de_passe, ...safe } = u;
                return safe;
            });

            console.log(`   Returning ${safeUsers.length} safe users`);
            res.json({ success: true, users: safeUsers });
        } catch (error) {
            console.error('❌ Error in getAll users:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const { mot_de_passe, ...safe } = user;

            let extra = {};
            if (user.role === 'ALUMNI') {
                extra = await Alumni.findByUserId(user.id_user) || {};
            }

            res.json({ success: true, user: { ...safe, ...extra } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            console.log(`📥 DELETE /users/${req.params.id} called`);
            const deleted = await User.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'User not found or already deleted' });
            }
            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('❌ Error in delete user:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    validateUser: async (req, res) => {
        try {
            console.log(`📥 PUT /users/${req.params.id}/validate called`);
            const updated = await User.update(req.params.id, { est_verifie: true });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.json({ success: true, message: 'Utilisateur validé avec succès' });
        } catch (error) {
            console.error('❌ Error validating user:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = userController;