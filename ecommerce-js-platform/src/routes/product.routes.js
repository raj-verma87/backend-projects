const { Router } = require('express');
const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { isAdmin } = require('../middlewares/auth.middleware'); // Assuming you have isAdmin middleware for role validation
const multer = require('multer');
const validateProduct = require('../middlewares/validate.product');

const router = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // File upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', isAdmin, upload.single('image'), validateProduct, createProduct);   // Admin only
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', isAdmin, upload.single('image'), updateProduct); // Admin only
router.delete('/:id', isAdmin, deleteProduct);                      // Admin only

module.exports = router;
