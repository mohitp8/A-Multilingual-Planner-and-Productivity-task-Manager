const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

// Lightweight .env loader so local deployments can use .env without an extra dependency.
const envFile = path => {
  try {
    const text = fs.readFileSync(path, 'utf8');
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const i = line.indexOf('='); if (i < 1) continue;
      const key = line.slice(0,i).trim(); const value = line.slice(i+1).trim().replace(/^['"]|['"]$/g,'');
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {}
};

const ROOT = path.resolve(__dirname);
envFile(path.join(ROOT, '.env'));
const FRONTEND = path.join(ROOT, 'frontend');
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'hitmo.db');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER','ADMIN')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  occupation TEXT,
  productivity_goal TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'dark',
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  ai_enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'TODO',
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  category TEXT NOT NULL DEFAULT 'OTHER',
  tags TEXT,
  pomodoro_count INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  deadline TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON tasks(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_deadline ON tasks(user_id, deadline);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE TABLE IF NOT EXISTS chat_conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Hitmo AI',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('USER','ASSISTANT','SYSTEM')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id, created_at);
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  scheduled_for TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE TABLE IF NOT EXISTS productivity_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata TEXT,
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_productivity_user ON productivity_events(user_id, occurred_at);
`);

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@hitmo.local').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const SUPPORTED_LANGUAGES = new Set(['en','hi','mr','es','fr','pt']);
const SUPPORTED_THEMES = new Set(['dark','light']);

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, expected] = String(stored).split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function newId() { return crypto.randomUUID(); }
function nowPlusDays(days) { return new Date(Date.now() + days * 86400000).toISOString(); }
function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'same-origin'
  });
  res.end(body);
}
function success(res, data) { json(res, 200, { success: true, data }); }
function error(res, status, code, message) { json(res, status, { success: false, error: { code, message } }); }
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 1024 * 1024) { reject(new Error('Request body too large')); req.destroy(); return; }
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
function cleanUser(row) { return row ? { id: row.id, name: row.name, email: row.email, role: row.role } : null; }
function getUserFromToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  const row = db.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`).get(hashToken(token), new Date().toISOString());
  return row || null;
}
function requireAuth(req, res) {
  const user = getUserFromToken(req);
  if (!user) { error(res, 401, 'UNAUTHORIZED', 'Please log in to continue.'); return null; }
  return user;
}
function requireAdmin(req, res) {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'ADMIN') { error(res, 403, 'FORBIDDEN', 'Administrator access required.'); return null; }
  return user;
}
function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)')
    .run(newId(), userId, hashToken(token), nowPlusDays(7));
  return token;
}
function validateTaskInput(body, partial = false) {
  const allowedPriorities = ['LOW','MEDIUM','HIGH','URGENT'];
  const allowedStatuses = ['TODO','IN_PROGRESS','COMPLETED','CANCELLED','ARCHIVED'];
  if (!partial && (!body.title || typeof body.title !== 'string' || !body.title.trim())) return 'Task title is required.';
  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length > 255)) return 'Task title must be 1-255 characters.';
  if (body.priority !== undefined && !allowedPriorities.includes(String(body.priority).toUpperCase())) return 'Invalid priority.';
  if (body.status !== undefined && !allowedStatuses.includes(String(body.status).toUpperCase())) return 'Invalid status.';
  return null;
}
function taskRow(row) {
  if (!row) return null;
  return { id: row.id, title: row.title, description: row.description || '', status: row.status, priority: row.priority, category: row.category, tags: row.tags || '', pomodoroCount: row.pomodoro_count, completed: !!row.completed, deadline: row.deadline, createdAt: row.created_at, updatedAt: row.updated_at };
}
function createUser(name, email, password, role='USER') {
  const id = newId();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = hashPassword(password);
  db.prepare('INSERT INTO users(id,email,password_hash,name,role) VALUES(?,?,?,?,?)').run(id, normalizedEmail, passwordHash, name.trim(), role);
  db.prepare('INSERT INTO user_profiles(id,user_id) VALUES(?,?)').run(newId(), id);
  db.prepare('INSERT INTO user_preferences(id,user_id) VALUES(?,?)').run(newId(), id);
  return db.prepare('SELECT * FROM users WHERE id=?').get(id);
}

if (!db.prepare('SELECT id FROM users WHERE email=?').get(ADMIN_EMAIL)) {
  createUser('Administrator', ADMIN_EMAIL, ADMIN_PASSWORD, 'ADMIN');
}

db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(new Date().toISOString());

async function api(req, res, pathname) {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' }); return res.end(); }
  try {
    if (pathname === '/api/v1/health' && req.method === 'GET') return success(res, { status: 'ok', database: 'sqlite', time: new Date().toISOString() });

    if (pathname === '/api/v1/auth/register' && req.method === 'POST') {
      const b = await readBody(req);
      if (!b.name || b.name.trim().length < 2) return error(res, 400, 'INVALID_NAME', 'Please enter your full name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(b.email || ''))) return error(res, 400, 'INVALID_EMAIL', 'Please enter a valid email.');
      if (String(b.password || '').length < 8) return error(res, 400, 'WEAK_PASSWORD', 'Password must be at least 8 characters.');
      if (db.prepare('SELECT id FROM users WHERE email=?').get(String(b.email).trim().toLowerCase())) return error(res, 409, 'EMAIL_EXISTS', 'An account with this email already exists.');
      const user = createUser(b.name, b.email, b.password);
      if (SUPPORTED_LANGUAGES.has(String(b.language || '').toLowerCase())) db.prepare('UPDATE user_preferences SET language=? WHERE user_id=?').run(String(b.language).toLowerCase(), user.id);
      const token = createSession(user.id);
      return json(res, 201, { success: true, data: { accessToken: token, user: cleanUser(user) } });
    }

    if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
      const b = await readBody(req);
      const user = db.prepare('SELECT * FROM users WHERE email=?').get(String(b.email || '').trim().toLowerCase());
      if (!user || !verifyPassword(String(b.password || ''), user.password_hash)) return error(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
      const token = createSession(user.id);
      return success(res, { accessToken: token, user: cleanUser(user) });
    }

    if (pathname === '/api/v1/auth/logout' && req.method === 'POST') {
      const auth = req.headers.authorization || '';
      if (auth.startsWith('Bearer ')) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(auth.slice(7).trim()));
      return success(res, { message: 'Logged out successfully.' });
    }

    if (pathname === '/api/v1/auth/me' && req.method === 'GET') {
      const user = requireAuth(req, res); if (!user) return;
      return success(res, cleanUser(user));
    }

    if (pathname === '/api/v1/profile' && (req.method === 'GET' || req.method === 'PUT')) {
      const user = requireAuth(req, res); if (!user) return;
      if (req.method === 'GET') return success(res, db.prepare('SELECT * FROM user_profiles WHERE user_id=?').get(user.id));
      const b = await readBody(req);
      db.prepare('UPDATE user_profiles SET avatar_url=?,occupation=?,productivity_goal=?,timezone=?,updated_at=CURRENT_TIMESTAMP WHERE user_id=?')
        .run(b.avatarUrl || null, b.occupation || null, b.productivityGoal || null, b.timezone || 'Asia/Kolkata', user.id);
      return success(res, db.prepare('SELECT * FROM user_profiles WHERE user_id=?').get(user.id));
    }

    if (pathname === '/api/v1/preferences' && (req.method === 'GET' || req.method === 'PUT')) {
      const user = requireAuth(req, res); if (!user) return;
      if (req.method === 'GET') return success(res, db.prepare('SELECT * FROM user_preferences WHERE user_id=?').get(user.id));
      const b = await readBody(req);
      db.prepare('UPDATE user_preferences SET language=?,theme=?,notifications_enabled=?,ai_enabled=?,updated_at=CURRENT_TIMESTAMP WHERE user_id=?')
        .run(SUPPORTED_LANGUAGES.has(String(b.language || '').toLowerCase()) ? String(b.language).toLowerCase() : 'en', SUPPORTED_THEMES.has(String(b.theme || '').toLowerCase()) ? String(b.theme).toLowerCase() : 'dark', b.notificationsEnabled === false ? 0 : 1, b.aiEnabled === false ? 0 : 1, user.id);
      return success(res, db.prepare('SELECT * FROM user_preferences WHERE user_id=?').get(user.id));
    }

    if (pathname === '/api/v1/tasks' && req.method === 'GET') {
      const user = requireAuth(req, res); if (!user) return;
      const u = new URL(req.url, `http://${req.headers.host}`);
      let sql = 'SELECT * FROM tasks WHERE user_id=?'; const params = [user.id];
      for (const key of ['category','priority','status']) if (u.searchParams.get(key)) { sql += ` AND ${key}=?`; params.push(u.searchParams.get(key)); }
      if (u.searchParams.get('q')) { sql += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)'; const q=`%${u.searchParams.get('q').toLowerCase()}%`; params.push(q,q,q); }
      sql += ' ORDER BY created_at DESC';
      return success(res, db.prepare(sql).all(...params).map(taskRow));
    }

    if (pathname === '/api/v1/tasks' && req.method === 'POST') {
      const user = requireAuth(req, res); if (!user) return;
      const b = await readBody(req); const validation = validateTaskInput(b); if (validation) return error(res, 400, 'INVALID_TASK', validation);
      const id = newId(); const priority=String(b.priority||'MEDIUM').toUpperCase(); const status=String(b.status||'TODO').toUpperCase();
      db.prepare(`INSERT INTO tasks(id,user_id,title,description,status,priority,category,tags,pomodoro_count,completed,deadline) VALUES(?,?,?,?,?,?,?,?,?,?,?)`)
        .run(id,user.id,b.title.trim(),b.description||'',status,priority,b.category||'OTHER',b.tags||'',Number(b.pomodoroCount||0),status==='COMPLETED'?1:0,b.deadline||null);
      db.prepare('INSERT INTO productivity_events(id,user_id,task_id,event_type) VALUES(?,?,?,?)').run(newId(),user.id,id,'TASK_CREATED');
      return json(res,201,{success:true,data:taskRow(db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(id,user.id))});
    }

    const taskMatch = pathname.match(/^\/api\/v1\/tasks\/([^/]+)$/);
    if (taskMatch && req.method === 'PUT') {
      const user = requireAuth(req, res); if (!user) return;
      const id=taskMatch[1]; const existing=db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(id,user.id); if(!existing) return error(res,404,'TASK_NOT_FOUND','Task not found.');
      const b=await readBody(req); const validation=validateTaskInput(b,true); if(validation) return error(res,400,'INVALID_TASK',validation);
      const title=b.title===undefined?existing.title:b.title.trim(); const description=b.description===undefined?existing.description:b.description;
      const status=b.status===undefined?existing.status:String(b.status).toUpperCase(); const priority=b.priority===undefined?existing.priority:String(b.priority).toUpperCase();
      const category=b.category===undefined?existing.category:b.category; const tags=b.tags===undefined?existing.tags:b.tags; const deadline=b.deadline===undefined?existing.deadline:(b.deadline||null);
      const completed=status==='COMPLETED'?1:0; const pomo=b.pomodoroCount===undefined?existing.pomodoro_count:Number(b.pomodoroCount);
      db.prepare(`UPDATE tasks SET title=?,description=?,status=?,priority=?,category=?,tags=?,pomodoro_count=?,completed=?,deadline=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`).run(title,description,status,priority,category,tags,pomo,completed,deadline,id,user.id);
      db.prepare('INSERT INTO productivity_events(id,user_id,task_id,event_type) VALUES(?,?,?,?)').run(newId(),user.id,id,status==='COMPLETED'?'TASK_COMPLETED':'TASK_UPDATED');
      return success(res,taskRow(db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(id,user.id)));
    }
    if (taskMatch && req.method === 'DELETE') {
      const user=requireAuth(req,res); if(!user)return; const id=taskMatch[1]; const result=db.prepare('DELETE FROM tasks WHERE id=? AND user_id=?').run(id,user.id); if(!result.changes)return error(res,404,'TASK_NOT_FOUND','Task not found.'); return success(res,{deleted:true});
    }

    const pomoMatch=pathname.match(/^\/api\/v1\/tasks\/([^/]+)\/pomodoro$/);
    if (pomoMatch && req.method === 'PATCH') {
      const user=requireAuth(req,res); if(!user)return;
      const task=db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(pomoMatch[1],user.id);
      if(!task)return error(res,404,'TASK_NOT_FOUND','Task not found.');
      const count=Number(task.pomodoro_count||0)+1;
      db.prepare('UPDATE tasks SET pomodoro_count=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?').run(count,task.id,user.id);
      db.prepare('INSERT INTO productivity_events(id,user_id,task_id,event_type) VALUES(?,?,?,?)').run(newId(),user.id,task.id,'POMODORO_COMPLETED');
      return success(res,taskRow(db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(task.id,user.id)));
    }

    if (pathname === '/api/v1/chat/conversations' && req.method === 'GET') {
      const user=requireAuth(req,res); if(!user)return; return success(res,db.prepare('SELECT id,title,language,created_at as createdAt,updated_at as updatedAt FROM chat_conversations WHERE user_id=? ORDER BY updated_at DESC').all(user.id));
    }
    if (pathname === '/api/v1/chat/conversations' && req.method === 'POST') {
      const user=requireAuth(req,res); if(!user)return; const b=await readBody(req); const id=newId(); db.prepare('INSERT INTO chat_conversations(id,user_id,title,language) VALUES(?,?,?,?)').run(id,user.id,b.title||'Hitmo AI',b.language||'en'); return json(res,201,{success:true,data:{id,title:b.title||'Hitmo AI',language:b.language||'en'}});
    }
    const convMatch=pathname.match(/^\/api\/v1\/chat\/conversations\/([^/]+)\/messages$/);
    if(convMatch && req.method==='GET') { const user=requireAuth(req,res); if(!user)return; const conv=db.prepare('SELECT id FROM chat_conversations WHERE id=? AND user_id=?').get(convMatch[1],user.id); if(!conv)return error(res,404,'CONVERSATION_NOT_FOUND','Conversation not found.'); return success(res,db.prepare('SELECT id,role,content,created_at as createdAt FROM chat_messages WHERE conversation_id=? ORDER BY created_at ASC').all(conv.id)); }
    if(convMatch && req.method==='POST') { const user=requireAuth(req,res); if(!user)return; const conv=db.prepare('SELECT id FROM chat_conversations WHERE id=? AND user_id=?').get(convMatch[1],user.id); if(!conv)return error(res,404,'CONVERSATION_NOT_FOUND','Conversation not found.'); const b=await readBody(req); if(!['USER','ASSISTANT','SYSTEM'].includes(b.role)||!String(b.content||'').trim())return error(res,400,'INVALID_MESSAGE','Invalid chat message.'); const id=newId(); db.prepare('INSERT INTO chat_messages(id,conversation_id,role,content) VALUES(?,?,?,?)').run(id,conv.id,b.role,String(b.content).slice(0,20000)); db.prepare('UPDATE chat_conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?').run(conv.id); return json(res,201,{success:true,data:{id}}); }

    if (pathname === '/api/v1/notifications' && req.method === 'GET') { const user=requireAuth(req,res); if(!user)return; return success(res,db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50').all(user.id)); }

    if (pathname === '/api/v1/admin/stats' && req.method === 'GET') { const user=requireAdmin(req,res); if(!user)return; const users=db.prepare('SELECT COUNT(*) c FROM users').get().c; const tasks=db.prepare('SELECT COUNT(*) c FROM tasks').get().c; const completed=db.prepare('SELECT COUNT(*) c FROM tasks WHERE completed=1').get().c; return success(res,{users,tasks,completed}); }
    if (pathname === '/api/v1/admin/users' && req.method === 'GET') { const user=requireAdmin(req,res); if(!user)return; return success(res,db.prepare('SELECT id,name,email,role,created_at as createdAt FROM users ORDER BY created_at DESC').all()); }

    return error(res,404,'NOT_FOUND','API endpoint not found.');
  } catch (e) {
    console.error(e);
    return error(res,500,'SERVER_ERROR','Something went wrong on the server.');
  }
}

const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.mp3':'audio/mpeg','.wav':'audio/wav','.ico':'image/x-icon' };
function serveStatic(req,res,pathname) {
  let filePath;
  if (pathname === '/' || pathname === '') filePath = path.join(FRONTEND,'login.html');
  else if (pathname === '/app' || pathname === '/dashboard') filePath = path.join(FRONTEND,'index.html');
  else if (pathname === '/admin/dashboard') filePath = path.join(FRONTEND,'admin.html');
  else filePath = path.join(FRONTEND, pathname.replace(/^\//,''));
  if (!filePath.startsWith(FRONTEND) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) { filePath=path.join(FRONTEND,'login.html'); }
  res.writeHead(200,{'Content-Type':mime[path.extname(filePath).toLowerCase()]||'application/octet-stream','Cache-Control':path.extname(filePath)==='.html'?'no-cache':'public, max-age=3600'});
  fs.createReadStream(filePath).pipe(res);
}

const server=http.createServer(async (req,res)=>{
  const pathname=new URL(req.url,`http://${req.headers.host||'localhost'}`).pathname;
  if(pathname.startsWith('/api/')) return api(req,res,pathname);
  serveStatic(req,res,pathname);
});
server.listen(PORT,HOST,()=>console.log(`Hitmo Planner ready: http://${HOST}:${PORT}`));
process.on('SIGINT',()=>{db.close();process.exit(0)});
process.on('SIGTERM',()=>{db.close();process.exit(0)});
