const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from root directory
app.use(express.static(__dirname));

// Configure GitHub Pages base path
const basePath = process.env.NODE_ENV === 'production' ? '/daredevil' : '';

// Serve uploads directory
app.use(`${basePath}/uploads`, express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// API endpoints
app.post(`${basePath}/upload`, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({
        url: `${basePath}/uploads/${req.file.filename}`
    });
});

app.get(`${basePath}/images`, (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading uploads directory');
        }
        const images = files.map(file => ({
            url: `${basePath}/uploads/${file}`
        }));
        res.json(images);
    });
});

// Handle GitHub Pages routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
