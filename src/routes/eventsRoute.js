import express from 'express';
const router = express.Router();
import { getEvents } from '../controller/eventsController.js';

router.get("/getEvents", getEvents);

export default router;
