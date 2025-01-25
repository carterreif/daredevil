require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const cors = require('cors');
const app = express();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS configuration
const corsOptions = {
    origin: 'https://carterreif.github.io',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
    credentials: false,
    optionsSuccessStatus: 200,
    maxAge: 86400
};

// Enable CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

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
        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'daredevil-gallery'
        });

        console.log('Upload successful:', result.secure_url);

        // Store the URL
        uploadedImages.push({ url: result.secure_url });

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Error in upload:', error);
        res.status(500).json({ error: 'Error uploading image' });
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
