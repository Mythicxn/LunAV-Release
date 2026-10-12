const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const https = require('https');
const { spawn } = require('child_process');

const OWNER = 'Mythicxn';
const REPO = 'LunAV';
const RELEASE_API = `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`;
// App chính xuất ra thẳng 1 file LunAV.exe (không zip, không kèm số bản trong tên) -
// nên launcher tìm đúng asset tên 'LunAV.exe' trong release, không đòi tên theo version nữa.

let mainWindow;
let busy = false;
let uninstalling = false;

// Chỉ cho phép một Launcher chạy cùng lúc.
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
}

function dataRoot() {
  return path.join(app.getPath('userData'), 'LunAV');
}
function versionsRoot() { return path.join(dataRoot(), 'versions'); }
function stateFile() { return path.join(dataRoot(), 'state.json'); }
async function ensureDirs() { await fsp.mkdir(versionsRoot(), { recursive: true }); }

async function readState() {
  try { return JSON.parse(await fsp.readFile(stateFile(), 'utf8')); }
  catch { return { currentVersion: null }; }
}
async function writeState(state) {
  const tmp = stateFile() + '.tmp';
  await fsp.writeFile(tmp, JSON.stringify(state, null, 2));
  await fsp.rename(tmp, stateFile());
}

function sendStatus(message, kind='info', progress=null) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('launcher:status', { message, kind, progress });
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'LunAV-Launcher', 'Accept': 'application/vnd.github+json' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return requestJson(res.headers.location).then(resolve, reject);
      let body=''; res.setEncoding('utf8');
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`GitHub API returned HTTP ${res.statusCode}`));
        try { resolve(JSON.parse(body)); } catch { reject(new Error('GitHub API returned invalid JSON')); }
      });
    });
    req.setTimeout(15000, () => req.destroy(new Error('GitHub connection timed out')));
    req.on('error', reject);
  });
}

function downloadFile(url, destination, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    const get = (target) => https.get(target, { headers: { 'User-Agent': 'LunAV-Launcher', 'Accept': 'application/octet-stream' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) { res.resume(); return get(res.headers.location); }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`Download failed: HTTP ${res.statusCode}`)); }
      const total = Number(res.headers['content-length']) || 0; let received = 0;
      res.on('data', chunk => { received += chunk.length; if (total) onProgress(Math.round(received / total * 100)); });
      res.pipe(file);
      res.on('error', err => { file.close(); reject(err); });
      file.on('finish', () => file.close(resolve));
    });
    get(url).on('error', err => { file.close(); reject(err); });
  });
}

async function findExe(dir) {
  const preferred = path.join(dir, 'LunAV.exe');
  try { await fsp.access(preferred, fs.constants.X_OK); return preferred; } catch {}
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isFile() && e.name.toLowerCase().endsWith('.exe')) return p;
    if (e.isDirectory()) { const found = await findExe(p); if (found) return found; }
  }
  return null;
}

function validVersion(v) { return /^v?\d+\.\d+\.\d+$/.test(v || ''); }
function normalizeVersion(v) { return (v || '').replace(/^v/i, ''); }
function compareVersions(a,b) {
  const A=normalizeVersion(a).split('.').map(Number), B=normalizeVersion(b).split('.').map(Number);
  for(let i=0;i<3;i++){ if((A[i]||0)!==(B[i]||0)) return (A[i]||0)-(B[i]||0); }
  return 0;
}

async function getInstalled() {
  const state = await readState();
  if (!state.currentVersion) return { version:null, exe:null };
  const dir = path.join(versionsRoot(), normalizeVersion(state.currentVersion));
  const exe = await findExe(dir);
  if (!exe) return { version:null, exe:null };
  return { version: state.currentVersion, exe };
}

async function getLatestRelease() {
  const release = await requestJson(RELEASE_API);
  if (release.draft || release.prerelease) throw new Error('GitHub latest release is not a stable release.');
  const version = release.tag_name;
  if (!validVersion(version)) throw new Error(`Invalid release tag: ${version}`);
  const assets = release.assets || [];
  // Ưu tiên đúng tên "LunAV.exe" (đúng như build ra); nếu người tải lên lỡ đặt tên khác thì
  // vẫn chấp nhận file .exe đầu tiên đính kèm, để không bị kẹt vì một lỗi đặt tên nhỏ.
  const asset = assets.find(a => a.name.toLowerCase() === 'lunav.exe')
    || assets.find(a => a.name.toLowerCase().endsWith('.exe'));
  if (!asset) throw new Error(`Release ${version} trên GitHub chưa đính kèm file .exe nào.`);
  return { version, name: asset.name, url: asset.browser_download_url, size: asset.size, page: release.html_url };
}

// Xoá các thư mục version CŨ trong versions/ sau khi cập nhật thành công, chỉ giữ lại bản mới nhất -
// tránh việc mỗi lần cập nhật lại cộng dồn thêm 1 thư mục, tốn dung lượng ổ đĩa dần theo thời gian.
// Best-effort: nếu 1 bản cũ đang được chạy dở (file exe đang bị khoá) thì bỏ qua, không báo lỗi -
// lần dọn dẹp sau (lần cập nhật kế tiếp) sẽ tự thử xoá lại.
async function cleanupOldVersions(keepVersion) {
  const keep = normalizeVersion(keepVersion);
  let entries;
  try { entries = await fsp.readdir(versionsRoot(), { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (!e.isDirectory() || e.name === keep) continue;
    await fsp.rm(path.join(versionsRoot(), e.name), { recursive: true, force: true }).catch(() => {});
  }
}

async function installRelease(release) {
  await ensureDirs();
  const root = dataRoot();
  const staging = path.join(root, `.staging-${normalizeVersion(release.version)}-${Date.now()}`);
  await fsp.mkdir(staging, { recursive:true });
  try {
    const exePath = path.join(staging, 'LunAV.exe');
    sendStatus(`Đang tải LunAV ${release.version}…`, 'info', 0);
    await downloadFile(release.url, exePath, p => sendStatus(`Đang tải LunAV ${release.version}… ${p}%`, 'info', p));
    // Kiểm tra sơ bộ file tải về không bị hỏng/cụt (vd. GitHub trả về trang lỗi nhỏ thay vì file thật).
    const stat = await fsp.stat(exePath).catch(() => null);
    if (!stat || stat.size < 1024 * 1024) throw new Error('Bản tải về có vẻ không hợp lệ (file quá nhỏ hoặc bị lỗi giữa chừng).');
    const finalDir = path.join(versionsRoot(), normalizeVersion(release.version));
    try { await fsp.rm(finalDir, { recursive:true, force:true }); } catch {}
    await fsp.rename(staging, finalDir);
    const installedExe = await findExe(finalDir);
    if (!installedExe) throw new Error('Kiểm tra bản cài đặt thất bại: không tìm thấy LunAV.exe.');
    await writeState({ currentVersion: release.version, updatedAt: new Date().toISOString() });
    await cleanupOldVersions(release.version);
    sendStatus(`LunAV ${release.version} đã sẵn sàng.`, 'success', 100);
    return { version: release.version, exe: installedExe };
  } finally {
    await fsp.rm(staging, { recursive:true, force:true }).catch(()=>{});
  }
}

async function checkForUpdates() {
  if (uninstalling) return { ok:false, message:'LunAV đang được gỡ cài đặt.' };
  if (busy) return { ok:false, message:'Launcher đang xử lý một tác vụ khác.' };
  busy = true;
  try {
    const installed = await getInstalled();
    sendStatus('Đang kiểm tra GitHub…', 'info', null);
    const latest = await getLatestRelease();
    if (!installed.version) {
      sendStatus(`Chưa có LunAV cục bộ. Đang tải ${latest.version}…`, 'info', 0);
      const result = await installRelease(latest);
      return { ok:true, updated:true, latest, installed:result };
    }
    if (compareVersions(latest.version, installed.version) > 0) {
      sendStatus(`Có bản mới ${latest.version}. Đang cập nhật…`, 'info', 0);
      const result = await installRelease(latest);
      return { ok:true, updated:true, latest, installed:result };
    }
    sendStatus(`Version ${normalizeVersion(installed.version)} · Up to date`, 'success', 100);
    return { ok:true, updated:false, latest, installed };
  } catch (err) {
    const installed = await getInstalled().catch(()=>({version:null,exe:null}));
    if (installed.exe) sendStatus(`Offline/Update lỗi · Giữ LunAV ${normalizeVersion(installed.version)}`, 'warning', null);
    else sendStatus(`Chưa thể tải LunAV: ${err.message}`, 'error', null);
    return { ok:false, message:err.message, installed };
  } finally { busy=false; }
}

function launchInstalled() {
  if (uninstalling) return Promise.reject(new Error('LunAV đang được gỡ cài đặt.'));
  return getInstalled().then(installed => {
    if (uninstalling) throw new Error('LunAV đang được gỡ cài đặt.');
    if (!installed.exe) throw new Error('Chưa có bản LunAV cục bộ. Hãy kiểm tra cập nhật khi có mạng.');
    const child = spawn(installed.exe, [], { detached:true, stdio:'ignore', windowsHide:false, cwd:path.dirname(installed.exe) });
    child.unref();
    sendStatus(`LunAV ${normalizeVersion(installed.version)} đang chạy.`, 'success', 100);
    return { version: installed.version };
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({ width:980, height:620, minWidth:860, minHeight:560, frame:false, resizable:true, backgroundColor:'#090a12', icon:path.join(__dirname,'icon.ico'), webPreferences:{ contextIsolation:true, nodeIntegration:false, preload:path.join(__dirname,'preload.js') } });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

if (gotSingleInstanceLock) {
  app.whenReady().then(() => { createWindow(); setTimeout(() => checkForUpdates(), 700); });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}

ipcMain.handle('window:minimize', e => BrowserWindow.fromWebContents(e.sender)?.minimize());
ipcMain.handle('window:close', e => BrowserWindow.fromWebContents(e.sender)?.close());
ipcMain.handle('launcher:check', () => checkForUpdates());
ipcMain.handle('launcher:start', async () => {
  try { return { ok:true, ...(await launchInstalled()) }; }
  catch (err) { sendStatus(err.message, 'error', null); return { ok:false, message:err.message }; }
});
ipcMain.handle('launcher:info', async () => ({ installed: await getInstalled() }));
ipcMain.handle('launcher:uninstall', async () => {
  if (busy || uninstalling) {
    return { ok:false, message:'Launcher đang xử lý một tác vụ khác.' };
  }

  uninstalling = true;
  try {
    await fsp.rm(versionsRoot(), { recursive:true, force:true });
    await fsp.mkdir(versionsRoot(), { recursive:true });
    await writeState({ currentVersion:null });
    sendStatus('Đã gỡ LunAV. Dữ liệu người dùng được giữ nguyên.', 'success', 100);
    return { ok:true, message:'Đã gỡ LunAV. Dữ liệu người dùng được giữ nguyên.' };
  } catch (err) {
    sendStatus(`Không thể gỡ LunAV: ${err.message}`, 'error', null);
    return { ok:false, message:`Không thể gỡ LunAV: ${err.message}` };
  } finally {
    uninstalling = false;
  }
});
