require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const cors = require('cors');
const app = express();

// Configure Cloudinary
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log('Cloudinary Configuration:', {
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key ? '***' : 'missing',
    api_secret: cloudinaryConfig.api_secret ? '***' : 'missing'
});

cloudinary.config(cloudinaryConfig);

// Enable CORS for all origins in development
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Store uploaded image URLs in memory (in production, use a database)
let uploadedImages = [];

// Serve static files from root directory
app.use(express.static(__dirname));

// API endpoints
app.post('/upload', upload.single('image'), async (req, res) => {
    console.log('Received upload request');
    
    try {
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing file:', req.file.originalname);

        // Convert buffer to base64
        const base64Image = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

        // Upload to Cloudinary
        console.log('Uploading to Cloudinary with config:', {
            cloud_name: cloudinaryConfig.cloud_name,
            api_key: cloudinaryConfig.api_key ? 'present' : 'missing',
            api_secret: cloudinaryConfig.api_secret ? 'present' : 'missing'
        });

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'daredevil-gallery',
            resource_type: 'auto'
        }).catch(err => {
            console.error('Cloudinary upload error:', err);
            throw err;
        });

        console.log('Upload successful:', result.secure_url);

        // Store the URL
        const imageData = { 
            url: result.secure_url,
            public_id: result.public_id,
            created_at: new Date()
        };
        uploadedImages.push(imageData);

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Error in upload:', error);
        res.status(500).json({ error: error.message || 'Error uploading image' });
    }
});

app.get('/images', (req, res) => {
    console.log('Received request for images');
    console.log('Returning', uploadedImages.length, 'images');
    res.json(uploadedImages);
});

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
