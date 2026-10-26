import express from 'express';
import {
  createBirthRecord,
  getAllBirthRecords,
  getBirthRecordById,
  updateBirthRecord,
  getDashboardStats,
} from '../controllers/birthRecordController.js';

const router = express.Router();

router.post('/', createBirthRecord);
router.get('/', getAllBirthRecords);
router.get('/stats/dashboard', getDashboardStats);
router.get('/:id', getBirthRecordById);
router.put('/:id', updateBirthRecord);

export default router;
