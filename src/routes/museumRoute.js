import express from 'express';
const router = express.Router();
import { createMuseum, uploadMiddleware, setMuseumPic, setMuseumVideo } from '../controller/museumController.js';


// const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload/img", uploadMiddleware, setMuseumPic);

router.post("/upload/video", uploadMiddleware, setMuseumVideo);

router.post("/createMuseum", createMuseum);

export default router;
