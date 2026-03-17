import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filenames: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to allow only common image types
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

const requireSuperAdmin = requireRole(['super_admin']);

// @route   POST /api/upload
// @desc    Upload an image
// @access  Super Admin only
router.post('/', verifyToken, requireSuperAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Construct public URL. Assuming server runs on the domain directly or public folder is served at root.
        // For development, assuming the server is running on localhost:5000 and serving the public folder
        const protocol = req.protocol;
        const host = req.get('host');
        // Because we will serve the entire 'public' directory at root, the path will just be /uploads/...
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: imageUrl,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error: any) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
});

// @route   GET /api/upload
// @desc    List all uploaded images
// @access  Super Admin only
router.get('/', verifyToken, requireSuperAdmin, (req, res) => {
    try {
        if (!fs.existsSync(uploadDir)) {
            return res.status(200).json({ success: true, data: [] });
        }

        const files = fs.readdirSync(uploadDir);
        const protocol = req.protocol;
        const host = req.get('host');

        const images = files.map(file => {
            const stats = fs.statSync(path.join(uploadDir, file));
            return {
                filename: file,
                url: `${protocol}://${host}/uploads/${file}`,
                created_at: stats.mtime,
                size: stats.size
            };
        });

        // Sort by newest first
        images.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

        res.status(200).json({ success: true, data: images });
    } catch (error: any) {
        console.error('List Uploads Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete an uploaded image
// @access  Super Admin only
router.delete('/:filename', verifyToken, requireSuperAdmin, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadDir, filename);

        // Security check: ensure the file being deleted is actually in the upload directory
        if (!filePath.startsWith(uploadDir)) {
             return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.status(200).json({ success: true, message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    } catch (error: any) {
        console.error('Delete Upload Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
