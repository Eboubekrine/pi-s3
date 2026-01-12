const db = require('../config/database');

const dashboardController = {
    getStats: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Parallel fetching
            const [users] = await db.execute('SELECT role, COUNT(*) as count FROM utilisateur GROUP BY role');
            const [offers] = await db.execute('SELECT COUNT(*) as count FROM offre');
            const [events] = await db.execute('SELECT COUNT(*) as count FROM evenement WHERE date_evenement >= CURDATE()');
            const [partners] = await db.execute('SELECT COUNT(*) as count FROM partenaire');

            // Format data
            let stats = {
                students: 0,
                alumni: 0,
                admins: 0,
                totalUsers: 0,
                offers: offers[0].count,
                events: events[0].count,
                partners: partners[0].count
            };

            users.forEach(u => {
                if (u.role === 'STUDENT') stats.students = u.count;
                if (u.role === 'ALUMNI') stats.alumni = u.count;
                if (u.role === 'ADMIN') stats.admins = u.count;
            });
            stats.totalUsers = stats.students + stats.alumni + stats.admins;

            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = dashboardController;
