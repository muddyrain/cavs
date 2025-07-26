import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { getAllShortcuts } from './getShortcuts';


function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 不允许在渲染进程中使用 Node.js
      nodeIntegration: false,
      // 启用上下文隔离以增强安全性
      contextIsolation: true,
    },
  });
  // 启动时默认打开控制台
  win.webContents.openDevTools();
  // 加载应用的前端页面
  win.loadURL('http://localhost:5173'); // Vite default port
}

app.whenReady().then(createWindow);

ipcMain.handle('get-shortcuts', async () => {
  return getAllShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
