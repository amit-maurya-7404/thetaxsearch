import mongoose, { Schema, model, models } from 'mongoose'

const TableCellSchema = new Schema(
  {
    text: { type: String, required: true },
  },
  { _id: false }
)

const TableRowSchema = new Schema(
  {
    cells: [TableCellSchema],
  },
  { _id: false }
)

const ContentBlockSchema = new Schema(
  {
    type: { type: String, enum: ['text', 'heading', 'table'], default: 'text' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    paragraph: { type: String, default: '' },
    rows: [TableRowSchema],
  },
  { _id: false }
)

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    intro: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    content: { type: [ContentBlockSchema], default: [] },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    views: { type: Number, default: 0 },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    readingTime: { type: Number, default: 5 },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
)

const Blog = (models.Blog as mongoose.Model<any>) || model('Blog', BlogSchema)

export default Blog
