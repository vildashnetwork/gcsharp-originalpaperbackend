import express from 'express';
import Paper from '../models/Papers.js';

const router = express.Router();

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

// GET papers by category
router.get('/category/:category', async (req, res) => {
    try {
        const papers = await Paper.find({ category: req.params.category });
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET papers by year
router.get('/year/:year', async (req, res) => {
    try {
        const papers = await Paper.find({ examyear: parseInt(req.params.year) });
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create a new paper
router.post('/', async (req, res) => {
    try {
        const paper = new Paper(req.body);
        const savedPaper = await paper.save();
        res.status(201).json(savedPaper);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        const { title, category, department, year } = req.query;
        const filter = {};

        if (title) filter.title = { $regex: title, $options: 'i' };
        if (category) filter.category = category;
        if (department) filter.department = department;
        if (year) filter.examyear = parseInt(year);

        const papers = await Paper.find(filter);
        res.status(200).json(papers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;