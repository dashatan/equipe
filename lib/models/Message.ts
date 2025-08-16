import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  _id: string
  sender: string
  recipient?: string
  group?: string
  content: string
  type: 'text' | 'image' | 'file' | 'activity' | 'location'
  images: string[]
  metadata?: {
    fileName?: string
    fileSize?: number
    activityId?: string
    latitude?: number
    longitude?: number
  }
  isRead: boolean
  isEdited: boolean
  editedAt?: Date
  replyTo?: string
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'activity', 'location'],
    default: 'text'
  },
  images: [{
    type: String
  }],
  metadata: {
    fileName: String,
    fileSize: Number,
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity'
    },
    latitude: Number,
    longitude: Number
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
})

// Indexes
MessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 })
MessageSchema.index({ group: 1, createdAt: -1 })
MessageSchema.index({ recipient: 1, isRead: 1 })

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)