const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục lưu trữ tồn tại
// (src/middlewares -> src -> project root -> public/uploads/avatars, chỉ 2 cấp, không phải 3)
const uploadDir = path.join(__dirname, '../../public/uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // requireAuth/requireAuthApi luôn chạy trước middleware này và set req.user
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${req.user ? req.user.id : uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận tệp hình ảnh!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

// Bọc upload.single() để trả lỗi JSON (quá dung lượng, sai định dạng...) thay vì
// để lỗi rơi xuống errorMiddleware mặc định (thường trả HTML).
const uploadAvatarSingle = (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        }
        if (err) {
            return res.status(400).json({ success: false, message: err.message || 'Avatar upload failed.' });
        }
        next();
    });
};

module.exports = upload;
module.exports.uploadAvatarSingle = uploadAvatarSingle;