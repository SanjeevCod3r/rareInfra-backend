import express from 'express';
import { submitForm , getAllFormData , deleteContact } from '../controller/formcontroller.js';

const router = express.Router();

router.post('/submit', submitForm);
router.get("/all", getAllFormData);
router.post('/delete-contact', deleteContact);

export default router;