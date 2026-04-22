import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting GlanzDrive server...');
console.log('PORT:', PORT);
console.log('__dirname:', __dirname);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now(), port: PORT });
});

app.use(express.static(__dirname, {
  extensions: ['html']
}));

app.use((req, res, next) => {
  if (req.path === '/' || req.path.includes('.') || req.path.startsWith('/api')) return next();
  const clean = req.path.replace(/\/$/, '');
  const tryPath = path.join(__dirname, clean, 'index.html');
  if (fs.existsSync(tryPath)) return res.sendFile(tryPath);
  next();
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`GlanzDrive running on port ${PORT}`);
});
