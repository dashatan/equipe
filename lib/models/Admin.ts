import mongoose, { Document, Schema } from 'mongoose'

export interface IAdmin extends Document {
  _id: string
  user: string
  role: 'super_admin' | 'admin' | 'moderator' | 'content_manager'
  permissions: string[]
  isActive: boolean
  lastLogin?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'content_manager'],
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_groups', 
      'manage_activities',
      'manage_posts',
      'manage_content',
      'manage_images',
      'manage_admins',
      'view_analytics',
      'moderate_content',
      'send_notifications'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Indexes
AdminSchema.index({ user: 1 })
AdminSchema.index({ role: 1, isActive: 1 })

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)