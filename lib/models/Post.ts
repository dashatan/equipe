import mongoose, { Document, Schema } from 'mongoose'

export interface IPost extends Document {
  _id: string
  author: string
  content: string
  images: string[]
  group?: string
  activity?: string
  type: 'general' | 'group' | 'activity' | 'achievement'
  likes: string[]
  comments: {
    author: string
    content: string
    createdAt: Date
  }[]
  tags: string[]
  isPublic: boolean
  location?: string
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  images: [{
    type: String
  }],
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  },
  type: {
    type: String,
    enum: ['general', 'group', 'activity', 'achievement'],
    default: 'general'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    maxlength: 100
  }
}, {
  timestamps: true
})

// Indexes
PostSchema.index({ author: 1, createdAt: -1 })
PostSchema.index({ group: 1, createdAt: -1 })
PostSchema.index({ type: 1, isPublic: 1, createdAt: -1 })
PostSchema.index({ tags: 1 })

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)