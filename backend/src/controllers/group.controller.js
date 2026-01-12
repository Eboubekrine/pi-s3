const Group = require('../models/group.model');

class GroupController {

    // Créer un groupe
    static async createGroup(req, res) {
        try {
            const data = req.body;
            const groupId = await Group.create(data);
            res.status(201).json({ success: true, message: 'تم إنشاء المجموعة', data: { id: groupId } });
        } catch (error) {
            console.error('Create group error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Obtenir tous les groupes
    static async getAllGroups(req, res) {
        try {
            const groups = await Group.getAll();
            res.json({ success: true, data: groups });
        } catch (error) {
            console.error('Get all groups error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Obtenir un groupe par ID
    static async getGroupById(req, res) {
        try {
            const id = req.params.id;
            const group = await Group.findById(id);
            if (!group) return res.status(404).json({ success: false, message: 'المجموعة غير موجودة' });
            res.json({ success: true, data: group });
        } catch (error) {
            console.error('Get group by id error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Mettre à jour un groupe
    static async updateGroup(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const updated = await Group.update(id, data);
            if (!updated) return res.status(404).json({ success: false, message: 'المجموعة غير موجودة' });
            res.json({ success: true, message: 'تم تحديث المجموعة', data: updated });
        } catch (error) {
            console.error('Update group error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }

    // Supprimer un groupe
    static async deleteGroup(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Group.delete(id);
            if (!deleted) return res.status(404).json({ success: false, message: 'المجموعة غير موجودة' });
            res.json({ success: true, message: 'تم حذف المجموعة' });
        } catch (error) {
            console.error('Delete group error:', error);
            res.status(500).json({ success: false, message: 'خطأ في الخادم' });
        }
    }
}

module.exports = GroupController;
