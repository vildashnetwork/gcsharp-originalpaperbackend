import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import env from 'dotenv';

env.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARYNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signed URL for private files
router.get('/sign', (req, res) => {
    try {
        const { publicId, resourceType = 'raw' } = req.query;

        if (!publicId) {
            return res.status(400).json({ error: 'publicId is required' });
        }

        // Generate a signed URL that expires in 1 hour
        const signedUrl = cloudinary.url(publicId, {
            resource_type: resourceType,
            type: 'authenticated',
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
            secure: true,
        });

        res.json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: error.message });
    }
});

// routes/debug.js
router.get('/inspect', async (req, res) => {
    try {
        const { publicId, resourceType = 'raw' } = req.query;
        if (!publicId) return res.status(400).json({ error: 'publicId required' });

        // Try to find it under each possible type
        const results = {};
        for (const type of ['upload', 'authenticated', 'private']) {
            try {
                const info = await cloudinary.api.resource(publicId, {
                    resource_type: resourceType,
                    type,
                });
                results[type] = { found: true, secure_url: info.secure_url, created_at: info.created_at };
            } catch (err) {
                results[type] = { found: false, error: err.error?.message || err.message };
            }
        }
        res.json({ publicId, resourceType, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;