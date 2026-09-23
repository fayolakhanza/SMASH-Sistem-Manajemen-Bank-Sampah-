"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.nasabahBuktiStorage = exports.multerStorage = void 0;
exports.getFileUrl = getFileUrl;
exports.getNasabahBuktiUrl = getNasabahBuktiUrl;
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
exports.multerStorage = (0, multer_1.diskStorage)({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname) || '.jpg';
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
exports.nasabahBuktiStorage = (0, multer_1.diskStorage)({
    destination: (req, file, callback) => {
        const nasabahId = req.user?.nasabah?.id || 'umum';
        const targetDir = `./uploads/nasabah/${nasabahId}`;
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        callback(null, targetDir);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname) || '.jpg';
        callback(null, `bukti-sampah-${uniqueSuffix}${ext}`);
    },
});
function getFileUrl(req, filename) {
    if (!filename)
        return undefined;
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${filename}`;
}
function getNasabahBuktiUrl(req, filename) {
    if (!filename)
        return undefined;
    const nasabahId = req.user?.nasabah?.id || 'umum';
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/nasabah/${nasabahId}/${filename}`;
}
//# sourceMappingURL=file-upload.util.js.map