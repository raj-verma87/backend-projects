import { Router } from 'express';
import { getAllUsers, deleteUser, getAllProducts, deleteProduct } from '../controllers/admin.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/role.middleware';

const router = Router();

// Protect admin routes with authentication and RBAC
router.use(authMiddleware);
router.use(authorize(['admin']));

// Admin routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// router.get('/products', getAllProducts);
// router.delete('/products/:id', deleteProduct);

export default router;
