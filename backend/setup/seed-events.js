// Script to seed events
const db = require('../config/database');

async function seedEvents() {
    try {
        console.log('🌱 Seeding events...');

        // Clear existing events? Let's just add new ones
        const events = [
            {
                titre: 'SupNum Alumni Gala 2026',
                description: 'A grand celebration of our alumni success and networking evening.',
                date_evenement: '2026-06-15',
                lieu: 'Main Hall, SupNum',
                id_organisateur: 1, // Admin
                image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
            },
            {
                titre: 'Tech Talk: Future of AI',
                description: 'Join us for an insightful talk about Artificial Intelligence trends in 2026.',
                date_evenement: '2026-02-10',
                lieu: 'Online / Zoom',
                id_organisateur: 4, // Ahmed (Student)
                image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
            },
            {
                titre: 'Coding Challenge #4',
                description: 'Competitive programming contest with amazing prizes.',
                date_evenement: '2026-03-05',
                lieu: 'Computer Lab 2',
                id_organisateur: 2, // Mamadou (Alumni)
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
            }
        ];

        for (const event of events) {
            await db.execute(
                'INSERT INTO evenement (titre, description, date_evenement, lieu, id_organisateur, image) VALUES (?, ?, ?, ?, ?, ?)',
                [event.titre, event.description, event.date_evenement, event.lieu, event.id_organisateur, event.image]
            );
        }

        console.log('✅ 3 Events seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedEvents();
