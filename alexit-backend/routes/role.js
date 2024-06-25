import express from 'express';
import { createRole, deleteRole, getAllRoles } from '../controllers/role.controller.js';



const router = express.Router();

router.get('/', getAllRoles);
router.post('/add', createRole);
router.delete('/delete/:id', deleteRole);



export default router;