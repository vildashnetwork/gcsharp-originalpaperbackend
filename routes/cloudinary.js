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
        const { publicId } = req.query;
        if (!publicId) return res.status(400).json({ error: 'publicId required' });

        const results = {};
        for (const resourceType of ['image', 'raw', 'video']) {
            for (const type of ['upload', 'authenticated', 'private']) {
                try {
                    const info = await cloudinary.api.resource(publicId, { resource_type: resourceType, type });
                    results[`${resourceType}/${type}`] = { found: true, secure_url: info.secure_url };
                } catch (err) {
                    results[`${resourceType}/${type}`] = { found: false };
                }
            }
        }
        res.json({ publicId, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: 'q required' });

        const result = await cloudinary.search
            .expression(`filename:*${q}*`)
            .with_field('context')
            .max_results(20)
            .execute();

        res.json(
            result.resources.map((r) => ({
                public_id: r.public_id,
                resource_type: r.resource_type,
                type: r.type,
                format: r.format,
                secure_url: r.secure_url,
                created_at: r.created_at,
            }))
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/list-all', async (req, res) => {
    try {
        const results = {};
        for (const resourceType of ['image', 'raw', 'video']) {
            const resp = await cloudinary.api.resources({
                resource_type: resourceType,
                type: 'upload',
                max_results: 30,
            });
            results[resourceType] = resp.resources.map((r) => ({
                public_id: r.public_id,
                created_at: r.created_at,
                bytes: r.bytes,
            }));
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message, http_code: error.http_code });
    }
});
export default router;