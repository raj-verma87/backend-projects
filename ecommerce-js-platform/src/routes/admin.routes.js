const { Router } = require('express');
const { 
  getAllUsers, 
  deleteUser, 
  getAllProducts, 
  deleteProduct, 
  updateUserRole, 
  getAllOrders, 
  updateOrderStatus, 
  getDashboardData 
} = require('../controllers/admin.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

const router = Router();

// Protect admin routes with authentication and RBAC
router.use(authMiddleware);
router.use(authorize(['admin']));

// Users management routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.delete('/users/:id/role', updateUserRole);

// Orders management routes
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// router.get('/products', getAllProducts);
// router.delete('/products/:id', deleteProduct);

// Dashboard route
router.get('/dashboard', getDashboardData);

module.exports = router;
