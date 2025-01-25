const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { put } = require('@vercel/blob');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from root directory
app.use(express.static(__dirname));

// Configure GitHub Pages base path
const basePath = process.env.NODE_ENV === 'production' ? '/daredevil' : '';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API endpoints
app.post(`${basePath}/upload`, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Upload to Vercel Blob Storage
        const blob = await put(req.file.originalname, req.file.buffer, {
            access: 'public',
        });

        res.json({
            url: blob.url
        });
    } catch (error) {
        console.error('Error uploading to blob storage:', error);
        res.status(500).send('Error uploading image');
    }
});

app.get(`${basePath}/images`, async (req, res) => {
    try {
        // For demo purposes, we'll return a success but empty array
        // In a production environment, you would implement listing blobs
        res.json([]);
    } catch (error) {
        console.error('Error listing images:', error);
        res.status(500).send('Error listing images');
    }
});

// Handle GitHub Pages routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
