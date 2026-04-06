import express from 'express';
import { getAdmin, verifyPassword, changePassword, changeUsername, createBackup, getBackupList, restoreBackup, deleteBackup, resetData } from '../database.js';

const router = express.Router();

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = getAdmin();
  
  if (username === admin.username && verifyPassword(password)) {
    req.session.adminLoggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 登出
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// 检查登录状态
router.get('/check', (req, res) => {
  res.json({ loggedIn: req.session.adminLoggedIn === true });
});

// 修改密码
router.post('/change-password', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  
  const { current_password, new_password, new_username } = req.body;
  
  if (!verifyPassword(current_password)) {
    return res.status(400).json({ success: false, message: '当前密码错误' });
  }
  
  if (new_password.length < 4) {
    return res.status(400).json({ success: false, message: '新密码长度不能少于4位' });
  }
  
  changePassword(new_password);
  if (new_username) {
    changeUsername(new_username);
  }
  
  req.session.destroy();
  res.json({ success: true });
});

// 备份数据
router.get('/backups', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  const backups = getBackupList();
  res.json({ success: true, backups });
});

// 创建备份
router.post('/backup', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  const filename = createBackup();
  res.json({ success: true, filename });
});

// 恢复备份
router.post('/restore-backup', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  const { filename } = req.body;
  const success = restoreBackup(filename);
  res.json({ success });
});

// 删除备份
router.post('/delete-backup', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  const { filename } = req.body;
  const success = deleteBackup(filename);
  res.json({ success });
});

// 重置数据
router.post('/reset', (req, res) => {
  if (!req.session.adminLoggedIn) {
    return res.status(403).json({ success: false, message: '未登录' });
  }
  const data = resetData();
  res.json({ success: true, data });
});

export default router;
