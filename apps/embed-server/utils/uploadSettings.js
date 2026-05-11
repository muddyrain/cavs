const path = require("path");
const fs = require("fs");
const multer = require("multer");

// 上传的地址
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 允许的扩展名与 MIME
const ALLOWED_EXTS = new Set([".pdf", ".md", ".txt"]);
const ALLOWED_MIMES = new Set([
  "application/pdf", // pdf
  "text/markdown", // md（有些浏览器可能识别为 text/plain）
  "text/plain", // txt / md 的退路
]);

// 存储策略
const storage = multer.diskStorage({
  // 配置存储目录
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  // 存储时的文件名
  filename: (_req, file, cb) => {
    // 防止中文/空格等问题 & 保留扩展名
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, "");
    cb(null, `${safeBase}_${Date.now()}${ext}`);
  },
});

// 过滤器：同时校验 MIME 与扩展名
function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIMES.has(file.mimetype);
  const extOk = ALLOWED_EXTS.has(ext);

  if (mimeOk || extOk) {
    cb(null, true);
  } else {
    cb(new Error("只允许上传 pdf、md、txt 文件"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  upload,
};
