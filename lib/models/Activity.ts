import mongoose, { Document, Schema } from 'mongoose'

export interface IActivity extends Document {
  _id: string
  title: string
  description: string
  group: string
  organizer: string
  category: string
  date: Date
  endDate?: Date
  location: string
  coordinates?: {
    lat: number
    lng: number
  }
  maxParticipants: number
  currentParticipants: number
  participants: string[]
  waitlist: string[]
  images: string[]
  cost: number
  currency: string
  difficulty: 'easy' | 'medium' | 'hard'
  equipment: string[]
  tags: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isPublic: boolean
  requirements: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new Schema<IActivity>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['outdoor', 'music', 'study', 'gaming', 'sports', 'art', 'tech', 'cooking', 'fitness', 'travel', 'social', 'volunteering']
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    required: true,
    maxlength: 200
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 1
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  waitlist: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: [{
    type: String
  }],
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  equipment: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
})

// Indexes
ActivitySchema.index({ group: 1, date: 1 })
ActivitySchema.index({ category: 1, status: 1 })
ActivitySchema.index({ date: 1, status: 1 })
ActivitySchema.index({ location: 1 })
ActivitySchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 })

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)