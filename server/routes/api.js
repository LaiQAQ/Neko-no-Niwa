import express from 'express';
import { getAllData, getPublicData, saveAllData, getDatabase, saveToFile } from '../database.js';

const router = express.Router();

// 获取所有数据
router.get('/data', (req, res) => {
  if (req.session.adminLoggedIn) {
    res.json(getAllData());
  } else {
    res.json(getPublicData());
  }
});

// 保存数据
router.post('/data', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  
  const data = req.body;
  try {
    saveAllData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 友链申请
router.post('/friend-apply', (req, res) => {
  const db = getDatabase();
  
  const { name, desc, href, avatar_emoji, avatar_color, contact } = req.body;
  
  if (!name || !desc || !href || !contact) {
    return res.status(400).json({ success: false, message: '请填写所有必填项' });
  }
  
  const id = Date.now();
  const created_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
  
  try {
    db.run(`INSERT INTO friend_applications (id, name, desc, href, avatarEmoji, avatarColor, contact, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`, [
      id, name, desc, href, avatar_emoji || '🐾', avatar_color || '#faeef1', contact, created_at
    ]);
    saveToFile();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
