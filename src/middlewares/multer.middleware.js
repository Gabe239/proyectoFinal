import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { fileType } = req.body; // Add a field in the request to identify the file type
        let uploadPath = 'uploads/documents'; // Default folder (documents)

        if (fileType === 'profile') {
            uploadPath = 'uploads/profiles';
        } else if (fileType === 'product') {
            uploadPath = 'uploads/products';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique file names (customize this as needed)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage });

export default upload;