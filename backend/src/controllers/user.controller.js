const User = require('../models/user.model');
const Alumni = require('../models/alumni.model');

class UserController {

    // الحصول على جميع المستخدمين
    static async getAllUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            res.json({ success: true, data: users });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // الحصول على مستخدم معين
    static async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
            }

            // Si ALUMNI, récupérer les données supplémentaires
            let alumniData = null;
            if (user.role === 'ALUMNI') {
                alumniData = await Alumni.findByUserId(id);
            }

            res.json({ success: true, data: { user, alumni: alumniData } });
        } catch (error) {
            console.error('Get user by id error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // تحديث المستخدم
    static async updateUser(req, res) {
        try {
            const id = req.params.id;
            const { nom, prenom, email, telephone, alumniData } = req.body;

            const updatedUser = await User.update(id, { nom, prenom, email, telephone });

            // Mise à jour des données ALUMNI si nécessaire
            if (updatedUser.role === 'ALUMNI' && alumniData) {
                await Alumni.updateByUserId(id, alumniData);
            }

            res.json({ success: true, message: 'تم تحديث المستخدم', data: updatedUser });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // حذف المستخدم
    static async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const deleted = await User.update(id, { is_deleted: 1 }); // suppression soft

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
            }

            res.json({ success: true, message: 'تم حذف المستخدم' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // البحث عن المستخدمين
    static async searchUsers(req, res) {
        try {
            const query = req.params.query;
            const users = await User.searchUsers(query);
            res.json({ success: true, data: users });
        } catch (error) {
            console.error('Search users error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
}

module.exports = UserController;

