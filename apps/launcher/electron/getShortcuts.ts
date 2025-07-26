import fs from 'fs';
import path from 'path';
import { app, shell } from 'electron';


const startMenuPaths = [
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
  path.join(process.env.APPDATA || '', 'Microsoft\\Windows\\Start Menu\\Programs'),
  path.join(process.env.USERPROFILE || '', 'Desktop'), // 可选：扫描桌面
];

type Shortcut = {
  name: string;
  path: string;
  icon: string;
};

async function getShortcuts(dir: string): Promise<Shortcut[]> {
  let results: Shortcut[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);

  const promises = list.map(async file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      return await getShortcuts(filePath);
    } else if (file.endsWith('.lnk')) {
      try {
        const lnk = shell.readShortcutLink(filePath);
        const _fileIcon = await app.getFileIcon(lnk.target);
        const icon = _fileIcon.toDataURL() || ''
        return [{
          name: path.basename(file, '.lnk'),
          path: filePath,
          icon,
        }];
      } catch (e) {
        return [{
          name: path.basename(file, '.lnk'),
          path: filePath,
          icon: '',
        }];
      }
    }
    return [];
  });

  const nestedResults = await Promise.all(promises);
  // 扁平化数组
  return nestedResults.flat();
}

export function getAllShortcuts(): Promise<{ name: string; path: string; icon: string }[]> {
  let all: { name: string; path: string; icon: string }[] = [];
  const promises = startMenuPaths.map(dir => getShortcuts(dir));
  return Promise.all(promises).then(results => {
    all = results.flat();
    return all;
  });
}