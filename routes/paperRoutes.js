// import express from 'express';
// import Paper from '../models/Papers.js';

// import cloudinary from 'cloudinary';
// import multer from 'multer';
// import { PassThrough } from 'stream';

// const router = express.Router();



// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure multer for memory storage (handles large files)
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 200 * 1024 * 1024, // 200MB limit
//     },
// });



// // Endpoint to handle file upload to Cloudinary
// router.post('/upload-to-cloudinary', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file provided' });
//         }

//         console.log(`Uploading to Cloudinary: ${req.file.originalname}, Size: ${req.file.size} bytes`);

//         // Convert buffer to stream for Cloudinary upload
//         const bufferStream = new PassThrough();
//         bufferStream.end(req.file.buffer);

//         // Upload to Cloudinary with compression options
//         const result = await new Promise((resolve, reject) => {
//             const uploadStream = cloudinary.v2.uploader.upload_stream(
//                 {
//                     resource_type: 'raw',
//                     folder: 'papers',
//                     // For PDFs, we can use quality and format options
//                     quality: 'auto:low', // Low quality for compression
//                     format: 'pdf', // Keep as PDF
//                     flags: 'attachment', // Ensure it's downloadable
//                 },
//                 (error, result) => {
//                     if (error) reject(error);
//                     else resolve(result);
//                 }
//             );

//             bufferStream.pipe(uploadStream);
//         });

//         console.log('Cloudinary upload successful:', result.secure_url);
//         console.log('Original size:', req.file.size);
//         console.log('Compressed size:', result.bytes);

//         // Return the Cloudinary result
//         res.json({
//             secure_url: result.secure_url,
//             public_id: result.public_id,
//             resource_type: result.resource_type,
//             bytes: result.bytes,
//             originalSize: req.file.size,
//         });
//     } catch (error) {
//         console.error('Cloudinary upload error:', error);
//         res.status(500).json({ error: error.message || 'Upload failed' });
//     }
// });

// // Alternative endpoint for direct URL upload (if you want to use Cloudinary's transform API)
// router.post('/api/compress-pdf', async (req, res) => {
//     try {
//         const { cloudinaryPublicId } = req.body;

//         // Generate a compressed version using Cloudinary's transformation API
//         const compressedUrl = cloudinary.v2.url(cloudinaryPublicId, {
//             resource_type: 'raw',
//             quality: 'auto:low',
//             format: 'pdf',
//             flags: 'attachment',
//         });

//         res.json({ compressedUrl });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });




// // GET all papers
// router.get('/', async (req, res) => {
//     try {
//         const papers = await Paper.find().sort({ createdAt: -1 });
//         res.status(200).json(papers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET a single paper by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const paper = await Paper.findById(req.params.id);
//         if (!paper) {
//             return res.status(404).json({ message: 'Paper not found' });
//         }
//         res.status(200).json(paper);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET papers by category
// router.get('/category/:category', async (req, res) => {
//     try {
//         const papers = await Paper.find({ category: req.params.category });
//         res.status(200).json(papers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET papers by year
// router.get('/year/:year', async (req, res) => {
//     try {
//         const papers = await Paper.find({ examyear: parseInt(req.params.year) });
//         res.status(200).json(papers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // POST create a new paper
// // POST create a new paper
// router.post('/', async (req, res) => {
//     try {
//         console.log('Received paper data:', req.body); // Debug log

//         const paper = new Paper(req.body);
//         const savedPaper = await paper.save();
//         res.status(201).json(savedPaper);
//     } catch (error) {
//         console.error('Error saving paper:', error.message);
//         console.error('Full error:', error);

//         // Send detailed error message
//         res.status(400).json({
//             message: error.message,
//             errors: error.errors // Mongoose validation errors
//         });
//     }
// });

// // PUT update a paper
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedPaper = await Paper.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updatedPaper) {
//             return res.status(404).json({ message: 'Paper not found' });
//         }
//         res.status(200).json(updatedPaper);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // DELETE a paper
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedPaper = await Paper.findByIdAndDelete(req.params.id);
//         if (!deletedPaper) {
//             return res.status(404).json({ message: 'Paper not found' });
//         }
//         res.status(200).json({ message: 'Paper deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET papers with filters (search)
// router.get('/search', async (req, res) => {
//     try {
//         const { title, category, department, year } = req.query;
//         const filter = {};

//         if (title) filter.title = { $regex: title, $options: 'i' };
//         if (category) filter.category = category;
//         if (department) filter.department = department;
//         if (year) filter.examyear = parseInt(year);

//         const papers = await Paper.find(filter);
//         res.status(200).json(papers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



// export default router;




































import express from 'express';
import Paper from '../models/Papers.js';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { PassThrough } from 'stream';
import crypto from 'crypto';

const router = express.Router();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage (handles large files)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 200 * 1024 * 1024, // 200MB limit
    },
});

// Helper function to generate unique paper_id
const generatePaperId = () => {
    const prefix = 'pap';
    const randomString = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now().toString(36);
    return `${prefix}_${timestamp}_${randomString}`;
};

// Endpoint to handle file upload to Cloudinary
router.post('/upload-to-cloudinary', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        console.log(`Uploading to Cloudinary: ${req.file.originalname}, Size: ${req.file.size} bytes`);

        // Convert buffer to stream for Cloudinary upload
        const bufferStream = new PassThrough();
        bufferStream.end(req.file.buffer);

        // Upload to Cloudinary with compression options
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'papers',
                    quality: 'auto:low',
                    format: 'pdf',
                    flags: 'attachment',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            bufferStream.pipe(uploadStream);
        });

        console.log('Cloudinary upload successful:', result.secure_url);
        console.log('Original size:', req.file.size);
        console.log('Compressed size:', result.bytes);

        // Return the Cloudinary result
        res.json({
            secure_url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
            bytes: result.bytes,
            originalSize: req.file.size,
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

// Alternative endpoint for direct URL upload (if you want to use Cloudinary's transform API)
router.post('/api/compress-pdf', async (req, res) => {
    try {
        const { cloudinaryPublicId } = req.body;

        // Generate a compressed version using Cloudinary's transformation API
        const compressedUrl = cloudinary.v2.url(cloudinaryPublicId, {
            resource_type: 'raw',
            quality: 'auto:low',
            format: 'pdf',
            flags: 'attachment',
        });

        res.json({ compressedUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all papers
router.get('/', async (req, res) => {
    try {
        const papers = await Paper.find().sort({ createdAt: -1 });
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single paper by ID
router.get('/:id', async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json(paper);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET papers by category (subject)
router.get('/category/:category', async (req, res) => {
    try {
        const papers = await Paper.find({ subject: req.params.category });
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET papers by year
router.get('/year/:year', async (req, res) => {
    try {
        const papers = await Paper.find({ year: parseInt(req.params.year) });
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET papers by level
router.get('/level/:level', async (req, res) => {
    try {
        const decodedLevel = decodeURIComponent(req.params.level);
        console.log(`Fetching papers for level: ${decodedLevel}`);
        const papers = await Paper.find({ level: decodedLevel });
        console.log(`Found ${papers.length} papers for level ${decodedLevel}`);
        res.status(200).json(papers);
    } catch (error) {
        console.error('Error fetching papers by level:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST create a new paper with auto-generated paper_id
router.post('/', async (req, res) => {
    try {
        console.log('Received paper data:', req.body);
        console.log('File size received:', req.body.fileSize);

        // Generate unique paper_id
        const paperId = generatePaperId();

        // Ensure fileSize is properly set
        const paperData = {
            ...req.body,
            paper_id: paperId,
            fileSize: req.body.fileSize || 0, // Ensure fileSize is always set
            fileType: req.body.fileType || 'application/pdf',
            uploadedBy: req.body.uploadedBy || null,
            uploaderName: req.body.uploaderName || 'Anonymous',
            downloads: 0,
        };

        console.log('Final paper data to save:', paperData);

        const paper = new Paper(paperData);
        const savedPaper = await paper.save();

        console.log('Paper saved successfully with fileSize:', savedPaper.fileSize);

        res.status(201).json(savedPaper);
    } catch (error) {
        console.error('Error saving paper:', error.message);
        console.error('Full error:', error);

        // Send detailed error message
        res.status(400).json({
            message: error.message,
            errors: error.errors // Mongoose validation errors
        });
    }
});

// PUT update a paper
router.put('/:id', async (req, res) => {
    try {
        const updatedPaper = await Paper.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPaper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json(updatedPaper);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a paper
router.delete('/:id', async (req, res) => {
    try {
        const deletedPaper = await Paper.findByIdAndDelete(req.params.id);
        if (!deletedPaper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET papers with filters (search)
router.get('/search', async (req, res) => {
    try {
        const { title, subject, level, year, paper_number } = req.query;
        const filter = {};

        if (title) filter.title = { $regex: title, $options: 'i' };
        if (subject) filter.subject = subject;
        if (level) filter.level = level;
        if (year) filter.year = parseInt(year);
        if (paper_number) filter.paper_number = parseInt(paper_number);

        const papers = await Paper.find(filter);
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalPapers = await Paper.countDocuments();
        const papers = await Paper.find();

        // Calculate total file size
        const totalSize = papers.reduce((sum, paper) => sum + (paper.fileSize || 0), 0);

        // Get unique subjects
        const uniqueSubjects = new Set(papers.map(p => p.subject)).size;

        // Count by level
        const levelCounts = {};
        papers.forEach(p => {
            if (p.level) {
                levelCounts[p.level] = (levelCounts[p.level] || 0) + 1;
            }
        });

        // Calculate average file size
        const avgFileSize = totalPapers > 0 ? totalSize / totalPapers : 0;

        res.status(200).json({
            totalPapers,
            totalSize,
            uniqueSubjects,
            levelCounts,
            avgFileSize,
            papers
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;