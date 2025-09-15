import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Create subdirectories
    const subdirs = ['kyc', 'temp'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(this.uploadDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });
  }

  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(this.uploadDir, 'kyc');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

  private fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed file types for KYC documents
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png, and .pdf files are allowed'));
    }
  };

  public getKycUploadMiddleware() {
    return multer({
      storage: this.storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5, // Maximum 5 files
      },
      fileFilter: this.fileFilter,
    }).array('documents', 5);
  }

  public getFileUrl(filename: string): string {
    return `/uploads/kyc/${filename}`;
  }

  public getFilePath(filename: string): string {
    return path.join(this.uploadDir, 'kyc', filename);
  }

  public deleteFile(filename: string): boolean {
    try {
      const filePath = this.getFilePath(filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  public validateFileSize(files: Express.Multer.File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`File ${index + 1} exceeds 10MB limit`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public validateFileTypes(files: Express.Multer.File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    files.forEach((file, index) => {
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`File ${index + 1} has invalid type. Only JPG, PNG, and PDF are allowed`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public cleanupTempFiles(): void {
    const tempDir = path.join(this.uploadDir, 'temp');
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    try {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.birthtimeMs > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up temp file: ${file}`);
        }
      });
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }
}

export const uploadService = new UploadService();

// Clean up temp files every hour
setInterval(() => {
  uploadService.cleanupTempFiles();
}, 60 * 60 * 1000);