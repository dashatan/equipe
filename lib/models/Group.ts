import mongoose, { Document, Schema } from 'mongoose'

export interface IGroup extends Document {
  _id: string
  name: string
  description: string
  category: string
  coverImage?: string
  images: string[]
  location: string
  coordinates?: {
    lat: number
    lng: number
  }
  maxMembers: number
  currentMembers: number
  members: string[]
  admins: string[]
  creator: string
  tags: string[]
  activityLevel: 'low' | 'medium' | 'high'
  ageRange: {
    min: number
    max: number
  }
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all'
  meetingFrequency: string
  isPublic: boolean
  isActive: boolean
  upcomingActivities: string[]
  pastActivities: string[]
  rating: number
  ratingCount: number
  createdAt: Date
  updatedAt: Date
}

const GroupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['outdoor', 'music', 'study', 'gaming', 'sports', 'art', 'tech', 'cooking', 'fitness', 'travel', 'social', 'volunteering']
  },
  coverImage: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  location: {
    type: String,
    required: true,
    maxlength: 200
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  maxMembers: {
    type: Number,
    required: true,
    min: 2,
    max: 1000
  },
  currentMembers: {
    type: Number,
    default: 1
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  activityLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  ageRange: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 65 }
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all'],
    default: 'all'
  },
  meetingFrequency: {
    type: String,
    default: 'Weekly'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  upcomingActivities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  pastActivities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes
GroupSchema.index({ category: 1 })
GroupSchema.index({ location: 1 })
GroupSchema.index({ tags: 1 })
GroupSchema.index({ isPublic: 1, isActive: 1 })
GroupSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 })

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema)