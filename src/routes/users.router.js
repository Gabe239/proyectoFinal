import express from 'express';
import multerMiddleware from '../middlewares/multer.middleware.js';
import {
    getUsers,
    changeUserRoleToPremium,
    uploadFiles,
    deleteInactive,
    deleteUser,
    updateRole
} from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/change-role/:userId', changeUserRoleToPremium);
router.post('/:uid/documents', multerMiddleware.array('documents'), uploadFiles);
router.delete('/deleteInactive', deleteInactive);
router.delete('/deleteUser', deleteUser);
router.put('/updateRole', updateRole);

export default router;