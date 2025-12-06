import mongoose, { Schema, model, models } from 'mongoose'

const ContentBlockSchema = new Schema(
  {
    subtitle: { type: String, required: true },
    paragraph: { type: String, required: true },
  },
  { _id: false }
)

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    intro: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    content: { type: [ContentBlockSchema], default: [] },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
)

const Blog = (models.Blog as mongoose.Model<any>) || model('Blog', BlogSchema)

export default Blog
