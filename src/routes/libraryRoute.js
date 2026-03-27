import express from 'express';
const router = express.Router();
import {getLibraries } from '../controller/libraryController.js';

router.get("/getLibraries", getLibraries);

export default router;
