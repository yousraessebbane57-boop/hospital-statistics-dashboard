import mongoose from 'mongoose';

const birthRecordSchema = new mongoose.Schema(
  {
    motherName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    admissionDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    deliveryType: { type: String, required: true, enum: ['normal', 'c_section'] },
    complications: { type: Boolean, default: false },
    complicationsDescription: { type: String, trim: true, default: '' },
    babyGender: { type: String, required: true, enum: ['male', 'female'] },
    babyWeight: { type: Number, required: true, min: 0, max: 10 }, // kg
    apgarScore: { type: Number, min: 0, max: 10 },
    responsiblePersonnel: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

birthRecordSchema.index({ motherName: 'text' });
birthRecordSchema.index({ deliveryDate: 1 });
birthRecordSchema.index({ responsiblePersonnel: 1 });

export const BirthRecord = mongoose.model('BirthRecord', birthRecordSchema);
