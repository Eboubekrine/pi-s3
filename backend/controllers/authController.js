const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Alumni = require('../models/Alumni');

const authController = {
    register: async (req, res) => {
        try {
            console.log('Register request:', req.body);
            const { nom, prenom, email, mot_de_passe, role = 'STUDENT', domaine, annee_diplome } = req.body;

            if (!nom || !prenom || !email || !mot_de_passe) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            // Validate @supnum.mr email domain
            if (!email.toLowerCase().endsWith('@supnum.mr')) {
                return res.status(400).json({
                    success: false,
                    message: 'Seuls les emails @supnum.mr sont autorisés'
                });
            }

            // Validate domaine (DSI, RSS, DWM) - required
            const validDomaines = ['DSI', 'RSS', 'DWM'];
            if (!domaine || !validDomaines.includes(domaine.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: 'Le domaine est obligatoire (DSI, RSS ou DWM)'
                });
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }

            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

            const isAlumni = role === 'ALUMNI' || role === 'Alumni';

            const userId = await User.create({
                nom, prenom, email, mot_de_passe: hashedPassword, role,
                domaine: domaine.toUpperCase(),
                est_verifie: isAlumni ? false : true
            });

            if (isAlumni) {
                try {
                    await Alumni.create({
                        id_user: userId,
                        annee_diplome: annee_diplome || null,
                        specialite: domaine || null,
                        entreprise_actuelle: null,
                        poste: null,
                        linkedin: null
                    });
                } catch (alumniError) {
                    console.error('Error creating alumni record:', alumniError);
                }

                // Alumni must wait for admin validation - no token
                return res.status(201).json({
                    success: true,
                    pendingValidation: true,
                    message: 'Inscription réussie. Votre compte est en attente de validation par l\'administrateur.'
                });
            }

            const token = jwt.sign(
                { userId, email, role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: { id_user: userId, nom, prenom, email, role, domaine: domaine.toUpperCase() }
            });

        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ success: false, message: error.message || 'Error registering user' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password required'
                });
            }

            // Validate @supnum.mr email domain
            if (!email.toLowerCase().endsWith('@supnum.mr')) {
                return res.status(403).json({
                    success: false,
                    message: 'Seuls les emails @supnum.mr sont autorisés'
                });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isMatch = await bcrypt.compare(password, user.mot_de_passe);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Block alumni who are not yet validated by admin
            if (user.role === 'ALUMNI' && !user.est_verifie) {
                return res.status(403).json({
                    success: false,
                    pendingValidation: true,
                    message: 'Votre compte est en attente de validation par l\'administrateur.'
                });
            }

            const token = jwt.sign(
                { userId: user.id_user, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Hide password
            const { mot_de_passe, ...userSafe } = user;

            res.json({
                success: true,
                token,
                user: userSafe
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging in'
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            // req.user is set by auth middleware
            const user = await User.findById(req.user.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const { mot_de_passe, ...userSafe } = user;

            let alumniData = {};
            if (user.role === 'ALUMNI') {
                alumniData = await Alumni.findByUserId(user.id_user) || {};
            }

            res.json({
                success: true,
                user: { ...userSafe, ...alumniData }
            });

        } catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({ message: 'Error fetching profile' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId;
            const updates = req.body;

            // Handle file uploads
            let avatarUrl = updates.avatar;
            let cvUrl = updates.cv_url;

            if (req.files) {
                const protocol = req.get('x-forwarded-proto') || req.protocol;
                const host = req.get('host');
                const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;

                if (req.files.avatar?.[0]) {
                    avatarUrl = `${baseUrl}/uploads/${req.files.avatar[0].filename}`;
                    console.log('🖼️ Profile Avatar URL:', avatarUrl);
                }
                if (req.files.cv?.[0]) {
                    cvUrl = `${baseUrl}/uploads/${req.files.cv[0].filename}`;
                    console.log('📄 CV URL:', cvUrl);
                }
            }

            // Map frontend fields (Profile.jsx) to Backend columns
            // Profile.jsx uses: name, bio, phone, birthday, avatar, linkedin, github, facebook, location...

            const userUpdates = {};
            if (updates.name) {
                const parts = updates.name.split(' ');
                userUpdates.prenom = parts[0];
                userUpdates.nom = parts.slice(1).join(' ') || parts[0];
            }
            if (updates.email) userUpdates.email = updates.email;
            if (updates.phone !== undefined) userUpdates.telephone = updates.phone;
            if (updates.birthday !== undefined) userUpdates.date_naissance = updates.birthday;
            if (updates.bio !== undefined) userUpdates.bio = updates.bio;
            if (avatarUrl !== undefined) userUpdates.avatar = avatarUrl;
            if (cvUrl !== undefined) userUpdates.cv_url = cvUrl;

            // Common fields for all users (previously Alumni only)
            if (updates.linkedin !== undefined) userUpdates.linkedin = updates.linkedin;
            if (updates.github !== undefined) userUpdates.github = updates.github;
            if (updates.facebook !== undefined) userUpdates.facebook = updates.facebook;
            if (updates.location !== undefined) userUpdates.localisation = updates.location;
            if (updates.company !== undefined) userUpdates.entreprise = updates.company;
            if (updates.jobTitle !== undefined) userUpdates.poste = updates.jobTitle;

            if (Object.keys(userUpdates).length > 0) {
                await User.update(userId, userUpdates);
            }

            // Alumni specific fields (Legacy sync if needed, but primarily for Mentorship)
            if (req.user.role === 'ALUMNI') {
                const alumniUpdates = {};
                if (updates.is_mentor !== undefined) alumniUpdates.disponible_mentorat = updates.is_mentor ? 1 : 0;
                if (updates.specialite) alumniUpdates.specialite = updates.specialite;
                if (updates.annee_diplome) alumniUpdates.annee_diplome = updates.annee_diplome;

                if (Object.keys(alumniUpdates).length > 0) {
                    await Alumni.update(userId, alumniUpdates);
                }
            }

            // Fetch fresh combined data
            const updatedUser = await User.findById(userId);
            let alumniData = {};
            if (updatedUser.role === 'ALUMNI') {
                alumniData = await Alumni.findByUserId(userId) || {};
            }

            const { mot_de_passe, ...safeUser } = updatedUser;
            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: { ...safeUser, ...alumniData }
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Error updating profile: ' + error.message });
        }
    }
};

module.exports = authController;