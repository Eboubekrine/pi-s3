const db = require('../config/database');

const dashboardController = {
    getStats: async (req, res) => {
        try {
            // General counts
            const [users] = await db.execute('SELECT role, COUNT(*) as count FROM utilisateur GROUP BY role');
            const [offers] = await db.execute('SELECT COUNT(*) as count FROM offre WHERE est_active = 1');
            const [events] = await db.execute('SELECT COUNT(*) as count FROM evenement WHERE date_evenement >= CURDATE()');
            const [partners] = await db.execute('SELECT COUNT(*) as count FROM partenaire');

            // Stats for charts
            const [entryYearData] = await db.execute(`
                SELECT YEAR(date_inscription) as year, COUNT(*) as count 
                FROM utilisateur 
                WHERE role = 'STUDENT' AND date_inscription IS NOT NULL
                GROUP BY year 
                ORDER BY year ASC
            `);

            const [promotionData] = await db.execute(`
                SELECT promotion, COUNT(*) as count 
                FROM alumni 
                WHERE promotion IS NOT NULL
                GROUP BY promotion
                ORDER BY promotion DESC
            `);

            const [specializationData] = await db.execute(`
                SELECT domaine, COUNT(*) as count 
                FROM utilisateur 
                WHERE domaine IS NOT NULL
                GROUP BY domaine
            `);

            const [offerTypeData] = await db.execute(`
                SELECT type_offre, COUNT(*) as count 
                FROM offre 
                GROUP BY type_offre
            `);

            let stats = {
                students: 0,
                alumni: 0,
                admins: 0,
                totalUsers: 0,
                offers: offers[0].count,
                events: events[0].count,
                partners: partners[0].count,
                charts: {
                    entryYear: entryYearData,
                    promotion: promotionData,
                    specialization: specializationData,
                    offerTypes: offerTypeData
                }
            };

            users.forEach(u => {
                if (u.role === 'STUDENT') stats.students = u.count;
                if (u.role === 'ALUMNI') stats.alumni = u.count;
                if (u.role === 'ADMIN') stats.admins = u.count;
            });
            stats.totalUsers = stats.students + stats.alumni + stats.admins;

            res.json({ success: true, data: stats });
        } catch (error) {
            console.error('getStats error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = dashboardController;
