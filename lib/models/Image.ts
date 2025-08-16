import mongoose, { Document, Schema } from 'mongoose'

export interface IImage extends Document {
  _id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  data: Buffer
  url: string
  alt?: string
  title?: string
  description?: string
  tags: string[]
  uploader: string
  entityType?: 'user' | 'group' | 'activity' | 'post' | 'message'
  entityId?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const ImageSchema = new Schema<IImage>({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    maxlength: 200
  },
  title: {
    type: String,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entityType: {
    type: String,
    enum: ['user', 'group', 'activity', 'post', 'message']
  },
  entityId: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
ImageSchema.index({ uploader: 1, createdAt: -1 })
ImageSchema.index({ entityType: 1, entityId: 1 })
ImageSchema.index({ tags: 1 })
ImageSchema.index({ isPublic: 1 })

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema)