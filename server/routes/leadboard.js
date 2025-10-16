import express from 'express';
import { createUser ,updateScore, getTopN, getUserRank } from '../controllers/leadboard.js';
const router = express.Router();

router.post('/', createUser); 
router.patch('/:id/score', updateScore);
router.get('/', getTopN);
router.get('/near/:userId', getUserRank);

export default router;