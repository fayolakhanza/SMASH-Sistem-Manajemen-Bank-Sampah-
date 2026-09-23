import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerStorage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname) || '.jpg';
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const nasabahBuktiStorage = diskStorage({
  destination: (req: any, file, callback) => {
    const nasabahId = req.user?.nasabah?.id || 'umum';
    const targetDir = `./uploads/nasabah/${nasabahId}`;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    callback(null, targetDir);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname) || '.jpg';
    callback(null, `bukti-sampah-${uniqueSuffix}${ext}`);
  },
});

export function getFileUrl(req: any, filename?: string): string | undefined {
  if (!filename) return undefined;
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${filename}`;
}

export function getNasabahBuktiUrl(req: any, filename?: string): string | undefined {
  if (!filename) return undefined;
  const nasabahId = req.user?.nasabah?.id || 'umum';
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/nasabah/${nasabahId}/${filename}`;
}
