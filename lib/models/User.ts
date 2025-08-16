import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password?: string
  avatar?: string
  bio?: string
  location?: string
  interests: string[]
  skills: string[]
  provider?: 'email' | 'google' | 'github' | 'apple'
  providerId?: string
  isEmailVerified: boolean
  completedActivities: number
  rating: number
  joinedGroups: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    type: String,
    maxlength: 100,
    default: ''
  },
  interests: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  provider: {
    type: String,
    enum: ['email', 'google', 'github', 'apple'],
    default: 'email'
  },
  providerId: {
    type: String,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  completedActivities: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  joinedGroups: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ location: 1 })
UserSchema.index({ interests: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)