const Groupe = require('../models/Groupe');

const groupeController = {
    create: async (req, res) => {
        try {
            const { nom, description, members } = req.body;
            const id_createur = req.user.userId || req.user.id_user;

            console.log('Creating group:', { nom, membersReceived: members, memberCount: members?.length, creatorId: id_createur });

            if (!nom) return res.status(400).json({ message: 'Name required' });

            const id = await Groupe.create({ nom, description, id_createur });
            console.log('Group created with ID:', id);

            // Add creator as member
            await Groupe.addMember(id_createur, id);
            console.log('Creator added as member');

            let addedCount = 0;
            // Add other selected members
            if (members && Array.isArray(members)) {
                console.log('Processing members array:', members);
                for (const rawId of members) {
                    const memberId = parseInt(rawId, 10);
                    console.log('Processing member:', { rawId, memberId, creatorId: id_createur, isCreator: memberId === id_createur });

                    // Prevent adding creator twice if selected
                    if (!isNaN(memberId) && memberId !== id_createur) {
                        try {
                            await Groupe.addMember(memberId, id);
                            addedCount++;
                            console.log(`Added member ${memberId} to group ${id}`);
                        } catch (e) {
                            console.error(`Failed to add member ${memberId}:`, e);
                        }
                    }
                }
            }

            console.log(`Group created. Total members added besides creator: ${addedCount}`);

            res.status(201).json({ success: true, message: 'Group created', id, membersAdded: addedCount + 1 });
        } catch (error) {
            console.error('Group creation error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const groups = await Groupe.findAll();
            res.json({ success: true, data: groups });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    join: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            await Groupe.addMember(userId, id);
            res.json({ success: true, message: 'Joined group' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getMembers: async (req, res) => {
        try {
            const members = await Groupe.getMembers(req.params.id);
            res.json({ success: true, data: members });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getMyGroups: async (req, res) => {
        try {
            const groups = await Groupe.getUserGroups(req.user.userId);
            res.json({ success: true, data: groups });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = groupeController;
