import { Router, Request, Response } from 'express';
import Enrollment from '../models/Enrollment';

const router = Router();

// GET all enrollments
router.get('/', async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new enrollment
router.post('/', async (req: Request, res: Response) => {
  try {
    const newEnrollment = new Enrollment(req.body);
    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an enrollment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(updatedEnrollment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an enrollment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedEnrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!deletedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
