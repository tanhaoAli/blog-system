import { Router, Request, Response } from 'express';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '请上传文件' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    data: { url: fileUrl },
    message: '上传成功'
  });
});

export default router;