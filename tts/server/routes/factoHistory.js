import express from 'express';
import {
  getAllHistory,
  addHistory,
  deleteHistory,
  clearHistory
} from '../lib/googleSheetsHistory.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const rows = await getAllHistory();
  res.json(rows.filter(r => r.userId === userId));
});

router.post('/', async (req, res) => {
  const item = req.body;
  await addHistory({
    ...item,
    createdAt: new Date(item.createdAt)
  });
  res.json({ success: true });
});

router.delete('/:userId/:historyId', async (req, res) => {
  const { userId, historyId } = req.params;
  await deleteHistory(userId, historyId);
  res.json({ success: true });
});

router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;
  await clearHistory(userId);
  res.json({ success: true });
});

export default router;