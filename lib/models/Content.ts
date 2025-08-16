import mongoose, { Document, Schema } from 'mongoose'

export interface IContent extends Document {
  _id: string
  type: 'page' | 'post' | 'announcement' | 'category' | 'landing_section' | 'faq' | 'legal'
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  images: string[]
  status: 'draft' | 'published' | 'archived'
  author: string
  lastModifiedBy: string
  tags: string[]
  metadata: {
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string[]
    showInNavigation?: boolean
    order?: number
    parentId?: string
    isSticky?: boolean
  }
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ContentSchema = new Schema<IContent>({
  type: {
    type: String,
    enum: ['page', 'post', 'announcement', 'category', 'landing_section', 'faq', 'legal'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  featuredImage: {
    type: String
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    seoTitle: {
      type: String,
      maxlength: 100
    },
    seoDescription: {
      type: String,
      maxlength: 300
    },
    seoKeywords: [{
      type: String,
      trim: true
    }],
    showInNavigation: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content'
    },
    isSticky: {
      type: Boolean,
      default: false
    }
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes
ContentSchema.index({ type: 1, status: 1 })
ContentSchema.index({ slug: 1 })
ContentSchema.index({ author: 1, createdAt: -1 })
ContentSchema.index({ tags: 1 })
ContentSchema.index({ 'metadata.showInNavigation': 1, 'metadata.order': 1 })

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema)