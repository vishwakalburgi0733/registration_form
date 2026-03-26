import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
    password: { type: String, required: false },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);

export default Enrollment;
