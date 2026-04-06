import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data.db');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

let db;
let SQL;

export async function initDatabase() {
  SQL = await initSqlJs();
  
  // 尝试加载现有数据库
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS basic (
      id INTEGER PRIMARY KEY,
      siteName TEXT, siteNameSub TEXT, ownerName TEXT, ownerSubtitle TEXT,
      bio TEXT, bioSub TEXT, statusText TEXT, quoteText TEXT, quoteAttr TEXT,
      footerSocial TEXT, footerMadeBy TEXT,
      seoTitle TEXT, seoKeywords TEXT, seoDescription TEXT, seoSubtitle TEXT
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL, color TEXT NOT NULL
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS socials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL, icon TEXT NOT NULL, href TEXT NOT NULL
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS about_boxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, items TEXT NOT NULL
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS diary (
      id INTEGER PRIMARY KEY, month TEXT NOT NULL, day TEXT NOT NULL,
      title TEXT NOT NULL, excerpt TEXT NOT NULL, tag TEXT NOT NULL,
      visible INTEGER DEFAULT 1
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS playlist (
      id INTEGER PRIMARY KEY, song TEXT NOT NULL, artist TEXT NOT NULL,
      emoji TEXT NOT NULL, bg TEXT NOT NULL, mood TEXT NOT NULL,
      visible INTEGER DEFAULT 1
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, desc TEXT NOT NULL,
      href TEXT NOT NULL, avatarColor TEXT NOT NULL, avatarEmoji TEXT NOT NULL,
      visible INTEGER DEFAULT 1
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS friend_applications (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, desc TEXT NOT NULL,
      href TEXT NOT NULL, avatarEmoji TEXT NOT NULL, avatarColor TEXT NOT NULL,
      contact TEXT NOT NULL, status TEXT DEFAULT 'pending', created_at TEXT NOT NULL
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS section_visibility (
      section TEXT PRIMARY KEY, visible INTEGER DEFAULT 1
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL, password TEXT NOT NULL
    );
  `);

  // 初始化管理员账号
  const adminExists = db.exec("SELECT * FROM admin WHERE id = 1");
  if (adminExists.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run("INSERT INTO admin (id, username, password) VALUES (?, ?, ?)", [1, 'admin', hashedPassword]);
  }

  // 初始化默认数据
  initDefaultData();
  saveToFile();
}

function initDefaultData() {
  const basicExists = db.exec("SELECT * FROM basic WHERE id = 1");
  if (basicExists.length === 0) {
    db.run(`INSERT INTO basic (id, siteName, siteNameSub, ownerName, ownerSubtitle, bio, bioSub, statusText, quoteText, quoteAttr, footerSocial, footerMadeBy, seoTitle, seoKeywords, seoDescription, seoSubtitle)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      1, "ねこの庭", "neko no niwa", "みずき · Mizuki", "illustrator · dreamer · cat person",
      "喜欢画画、喝茶和发呆。\n世界很大，我只想做一个安静的人。", "— 在某个不知名的角落创作着 —",
      "目前在画春天的猫咪系列 · currently drawing spring cats",
      "生活不必轰轰烈烈，\n有一杯热茶、一只猫、一个安静的下午，\n就已经足够好了。",
      "— みずき の手记", "ins: @mizuki_neko · pixiv: mizukineko · mail: hello@mizukineko.com", "made with ♡ by みずき",
      "ねこの庭", "插画,日系,猫猫,治愈,慢生活", "喜欢画画、喝茶和发呆的世界，记录日常的插画师博客", ""
    ]);

    // 初始化标签
    const tags = [
      { text: "插画", color: "pink" },
      { text: "日系", color: "blue" },
      { text: "猫猫爱好者", color: "sage" },
      { text: "治愈系", color: "pink" },
      { text: "慢生活", color: "blue" },
      { text: "文艺", color: "sage" }
    ];
    tags.forEach(t => db.run('INSERT INTO tags (text, color) VALUES (?, ?)', [t.text, t.color]));

    // 初始化社交链接
    const socials = [
      { label: "Twitter", href: "#", icon: "twitter" },
      { label: "Instagram", href: "#", icon: "instagram" },
      { label: "Pixiv", href: "#", icon: "pixiv" },
      { label: "Email", href: "mailto:hello@mizukineko.com", icon: "mail" }
    ];
    socials.forEach(s => db.run('INSERT INTO socials (label, icon, href) VALUES (?, ?, ?)', [s.label, s.icon, s.href]));

    // 初始化关于我板块
    const aboutBoxes = [
      { title: "喜欢的事物", items: ["下雨天在窗边发呆","收集各种质地的纸","逛旧书店和古物市场","煮一壶不同的茶叶","看猫咪睡觉","深夜画画听雨声"] },
      { title: "正在进行中", items: ["春日猫咪插画系列 · 进行中","手绘明信片小店筹备","学习刺绣与布艺","整理多年日记成册","尝试模拟摄影胶片"] },
      { title: "使用的工具", items: ["Procreate · iPad 主力创作","水彩 · 纸上手绘","VSCO · 照片调色","Notion · 整理灵感","Apple Pencil 二代"] },
      { title: "两只猫咪", items: ["小云 · 橘猫 · 4岁 · 吃货","豆腐 · 布偶 · 2岁 · 高冷","最喜欢趴在画板上睡觉","经常出现在我的插画里","是家里最重要的成员"] }
    ];
    aboutBoxes.forEach(box => db.run('INSERT INTO about_boxes (title, items) VALUES (?, ?)', [box.title, JSON.stringify(box.items)]));

    // 初始化日记
    const diaryEntries = [
      { id: 1, month: "04月", day: "03日", title: "春天来了，小云也变懒了", excerpt: "今天阳光很好，透过百叶窗打进来，小云就这样蜷在光斑里睡了一整个下午。我坐在旁边画画，偶尔抬头看它一眼，觉得这样的日子真的很值得珍惜。窗外的玉兰快开尽了，白色的花瓣一片一片落下来，不知道为什么，看着就想哭。", tag: "猫猫日记", visible: 1 },
      { id: 2, month: "03月", day: "21日", title: "第一次去旧书市集", excerpt: "在一个老旧的巷子里，藏着一个每周六才开的旧书集市。买了两本昭和时期的日式生活杂志，纸已经发黄，翻开来是那个年代很慢的生活方式——手写食谱、手工布艺、庭院里的四季。不知为何觉得很羡慕那种慢。", tag: "出门日记", visible: 1 },
      { id: 3, month: "03月", day: "08日", title: "新买的水彩纸有点不一样", excerpt: "换了一款新的冷压水彩纸，纹理比之前用的粗一些，颜料晕开来的感觉完全不同，有一种意外的粗粝感，但我竟然有点喜欢。豆腐一直在旁边盯着我的调色盘，大概在想那些颜色能不能吃。", tag: "创作日记", visible: 1 },
      { id: 4, month: "02月", day: "14日", title: "一个人的情人节也很好", excerpt: "自己做了草莓大福，第一次包，形状有点歪，但味道还行。小云和豆腐都凑过来闻，我就把它们的样子画下来了，草莓色的小鼻子，很可爱。窗外下着小雨，一个人在家，不觉得寂寞，只是很安静。", tag: "节日碎碎念", visible: 1 }
    ];
    diaryEntries.forEach(d => db.run('INSERT INTO diary (id, month, day, title, excerpt, tag, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', [d.id, d.month, d.day, d.title, d.excerpt, d.tag, d.visible]));

    // 初始化歌单
    const playlist = [
      { id: 1, song: "春はゆく", artist: "Aimer", emoji: "🌸", bg: "#faeef1", mood: "治愈", visible: 1 },
      { id: 2, song: "夜に駆ける", artist: "YOASOBI", emoji: "🌙", bg: "#eaf3f8", mood: "夜晚", visible: 1 },
      { id: 3, song: "말하는 감자", artist: "BIG Naughty", emoji: "🍃", bg: "#f0f4f0", mood: "慵懒", visible: 1 },
      { id: 4, song: "Rainy Season", artist: "sheishere", emoji: "☁️", bg: "#faf0f5", mood: "下雨天", visible: 1 },
      { id: 5, song: "もし君を許せたら", artist: "くじら", emoji: "✨", bg: "#f0eef8", mood: "深夜", visible: 1 },
      { id: 6, song: "猫 (cat)", artist: "スピッツ", emoji: "🐾", bg: "#faeef1", mood: "日常", visible: 1 }
    ];
    playlist.forEach(p => db.run('INSERT INTO playlist (id, song, artist, emoji, bg, mood, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', [p.id, p.song, p.artist, p.emoji, p.bg, p.mood, p.visible]));

    // 初始化友链
    const friends = [
      { id: 1, name: "星と猫の庭", desc: "水彩插画 · 治愈系日常 · 爱猫人", href: "#", avatarColor: "#faeef1", avatarEmoji: "🐱", visible: 1 },
      { id: 2, name: "しずく文庫", desc: "读书笔记 · 文艺碎语 · 旧书收藏", href: "#", avatarColor: "#eaf3f8", avatarEmoji: "📚", visible: 1 },
      { id: 3, name: "もふもふ日和", desc: "小动物摄影 · 生活流水 · 手账控", href: "#", avatarColor: "#f0f4f0", avatarEmoji: "🐾", visible: 1 },
      { id: 4, name: "夢みる猫屋", desc: "猫咪杂货 · 手工布偶 · 小众设计", href: "#", avatarColor: "#f0eef8", avatarEmoji: "🧸", visible: 1 },
      { id: 5, name: "紙と茶の間", desc: "手帐创作 · 茶道生活 · 文字游荡者", href: "#", avatarColor: "#faf5e8", avatarEmoji: "📝", visible: 1 }
    ];
    friends.forEach(f => db.run('INSERT INTO friends (id, name, desc, href, avatarColor, avatarEmoji, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', [f.id, f.name, f.desc, f.href, f.avatarColor, f.avatarEmoji, f.visible]));

    // 初始化板块可见性
    db.run('INSERT INTO section_visibility (section, visible) VALUES (?, ?)', ['about', 1]);
    db.run('INSERT INTO section_visibility (section, visible) VALUES (?, ?)', ['diary', 1]);
    db.run('INSERT INTO section_visibility (section, visible) VALUES (?, ?)', ['playlist', 1]);
    db.run('INSERT INTO section_visibility (section, visible) VALUES (?, ?)', ['friends', 1]);
  }
}

export function saveToFile() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveToFile();
}

// 获取所有数据
export function getAllData() {
  const basic = queryOne('SELECT * FROM basic WHERE id = 1');
  const tags = queryAll('SELECT * FROM tags');
  const socials = queryAll('SELECT * FROM socials');
  const aboutBoxes = queryAll('SELECT * FROM about_boxes').map(box => ({
    ...box,
    items: JSON.parse(box.items)
  }));
  const diary = queryAll('SELECT * FROM diary ORDER BY id DESC');
  const playlist = queryAll('SELECT * FROM playlist');
  const friends = queryAll('SELECT * FROM friends');
  const friendApplications = queryAll('SELECT * FROM friend_applications ORDER BY id DESC');
  const sectionVisibility = {};
  queryAll('SELECT * FROM section_visibility').forEach(s => {
    sectionVisibility[s.section] = s.visible === 1;
  });

  return {
    basic: {
      id: basic.id,
      siteName: basic.siteName,
      siteNameSub: basic.siteNameSub,
      ownerName: basic.ownerName,
      ownerSubtitle: basic.ownerSubtitle,
      bio: basic.bio,
      bioSub: basic.bioSub,
      statusText: basic.statusText,
      quoteText: basic.quoteText,
      quoteAttr: basic.quoteAttr,
      footerSocial: basic.footerSocial,
      footerMadeBy: basic.footerMadeBy,
      seoTitle: basic.seoTitle || '',
      seoKeywords: basic.seoKeywords || '',
      seoDescription: basic.seoDescription || '',
      seoSubtitle: basic.seoSubtitle || ''
    },
    tags: tags.map(t => ({ text: t.text, color: t.color })),
    socials: socials.map(s => ({ label: s.label, icon: s.icon, href: s.href })),
    aboutBoxes: aboutBoxes.map(b => ({ title: b.title, items: b.items })),
    diary: diary.map(d => ({ id: d.id, month: d.month, day: d.day, title: d.title, excerpt: d.excerpt, tag: d.tag, visible: d.visible === 1 })),
    playlist: playlist.map(p => ({ id: p.id, song: p.song, artist: p.artist, emoji: p.emoji, bg: p.bg, mood: p.mood, visible: p.visible === 1 })),
    friends: friends.filter(f => f.visible === 1).map(f => ({ id: f.id, name: f.name, desc: f.desc, href: f.href, avatarColor: f.avatarColor, avatarEmoji: f.avatarEmoji })),
    friend_applications: friendApplications.map(a => ({ ...a })),
    sectionVisibility
  };
}

// 获取公开数据（不包含友链）
export function getPublicData() {
  const data = getAllData();
  delete data.friend_applications;
  return data;
}

// 保存数据
export function saveAllData(data) {
  run(`UPDATE basic SET siteName = ?, siteNameSub = ?, ownerName = ?, ownerSubtitle = ?, bio = ?, bioSub = ?, statusText = ?, quoteText = ?, quoteAttr = ?, footerSocial = ?, footerMadeBy = ?, seoTitle = ?, seoKeywords = ?, seoDescription = ?, seoSubtitle = ? WHERE id = 1`, [
    data.basic.siteName, data.basic.siteNameSub, data.basic.ownerName, data.basic.ownerSubtitle,
    data.basic.bio, data.basic.bioSub, data.basic.statusText, data.basic.quoteText, data.basic.quoteAttr,
    data.basic.footerSocial, data.basic.footerMadeBy,
    data.basic.seoTitle || '', data.basic.seoKeywords || '', data.basic.seoDescription || '', data.basic.seoSubtitle || ''
  ]);

  // 标签
  db.run('DELETE FROM tags');
  data.tags.forEach(t => run('INSERT INTO tags (text, color) VALUES (?, ?)', [t.text, t.color]));

  // 社交链接
  db.run('DELETE FROM socials');
  data.socials.forEach(s => run('INSERT INTO socials (label, icon, href) VALUES (?, ?, ?)', [s.label, s.icon, s.href]));

  // 关于我
  db.run('DELETE FROM about_boxes');
  data.aboutBoxes.forEach(box => run('INSERT INTO about_boxes (title, items) VALUES (?, ?)', [box.title, JSON.stringify(box.items)]));

  // 日记
  db.run('DELETE FROM diary');
  data.diary.forEach(d => run('INSERT INTO diary (id, month, day, title, excerpt, tag, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', [d.id, d.month, d.day, d.title, d.excerpt, d.tag, d.visible ? 1 : 0]));

  // 歌单
  db.run('DELETE FROM playlist');
  data.playlist.forEach(p => run('INSERT INTO playlist (id, song, artist, emoji, bg, mood, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', [p.id, p.song, p.artist, p.emoji, p.bg, p.mood, p.visible ? 1 : 0]));

  // 友链
  db.run('DELETE FROM friends');
  data.friends.forEach(f => run('INSERT INTO friends (id, name, desc, href, avatarColor, avatarEmoji, visible) VALUES (?, ?, ?, ?, ?, ?, ?)', [f.id, f.name, f.desc, f.href, f.avatarColor, f.avatarEmoji, f.visible !== false ? 1 : 0]));

  // 友链申请
  db.run('DELETE FROM friend_applications');
  data.friend_applications.forEach(a => run('INSERT INTO friend_applications (id, name, desc, href, avatarEmoji, avatarColor, contact, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [a.id, a.name, a.desc, a.href, a.avatarEmoji, a.avatarColor, a.contact, a.status, a.created_at]));

  // 板块可见性
  if (data.sectionVisibility) {
    Object.entries(data.sectionVisibility).forEach(([section, visible]) => {
      db.run('INSERT OR REPLACE INTO section_visibility (section, visible) VALUES (?, ?)', [section, visible ? 1 : 0]);
    });
  }
}

// 重置数据
export function resetData() {
  db.run('DELETE FROM tags');
  db.run('DELETE FROM socials');
  db.run('DELETE FROM about_boxes');
  db.run('DELETE FROM diary');
  db.run('DELETE FROM playlist');
  db.run('DELETE FROM friends');
  db.run('DELETE FROM friend_applications');
  db.run('DELETE FROM section_visibility');
  db.run('DELETE FROM basic');
  
  initDefaultData();
  saveToFile();
  return getAllData();
}

// 创建备份
export function createBackup() {
  const data = getAllData();
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '.');
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map(v => String(v).padStart(2, '0')).join('-');
  const filename = `backup-${date}_${time}.json`;
  const filepath = path.join(BACKUP_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return filename;
}

// 获取备份列表
export function getBackupList() {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
    .sort()
    .reverse()
    .slice(0, 3);
  
  return files.map(f => {
    // 匹配 backup-YYYY.MM.DD_HH-MM-SS.json 格式
    const match = f.match(/backup-(\d{4}\.\d{2}\.\d{2})_(\d{2}-\d{2}-\d{2})\.json/);
    if (match) {
      return {
        filename: f,
        date: match[1],
        time: match[2].replace(/-/g, ':')
      };
    }
    return null;
  }).filter(Boolean);
}

// 恢复备份
export function restoreBackup(filename) {
  const filepath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(filepath)) return false;
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  saveAllData(data);
  return true;
}

// 删除备份
export function deleteBackup(filename) {
  const filepath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(filepath)) return false;
  fs.unlinkSync(filepath);
  return true;
}

// 验证密码
export function verifyPassword(password) {
  const admin = queryOne('SELECT * FROM admin WHERE id = 1');
  return bcrypt.compareSync(password, admin.password);
}

// 修改密码
export function changePassword(newPassword) {
  const hashed = bcrypt.hashSync(newPassword, 10);
  run('UPDATE admin SET password = ? WHERE id = 1', [hashed]);
  return true;
}

// 修改用户名
export function changeUsername(newUsername) {
  if (newUsername) {
    run('UPDATE admin SET username = ? WHERE id = 1', [newUsername]);
  }
  return true;
}

// 获取管理员信息
export function getAdmin() {
  return queryOne('SELECT id, username FROM admin WHERE id = 1');
}

export function getDatabase() {
  return db;
}
