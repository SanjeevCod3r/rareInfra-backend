import express from 'express';
import { addproperty, listproperty, removeproperty, updateproperty, singleproperty } from '../controller/productcontroller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Add property with multiple images
router.post('/add', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addproperty);

// List all properties
router.get('/list', listproperty);

// Remove property
router.post('/remove', removeproperty);

// Update property with multiple images
router.post('/update', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), async (req, res) => {
    try {
        await updateproperty(req, res);
    } catch (error) {
        console.error('Error in update property route:', error);
        res.status(500).json({ message: 'Server Error', success: false });
    }
});

// Get single property
router.get('/single/:id', singleproperty);

export default router;