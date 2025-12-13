import mongoose, { Document, Model } from 'mongoose'

export interface ILead extends Document {
  name: string
  email: string
  phone?: string
  message: string
  createdAt: Date
}

const LeadSchema = new mongoose.Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const Lead: Model<ILead> = (mongoose.models && (mongoose.models as any).Lead) || mongoose.model<ILead>('Lead', LeadSchema)

export default Lead
