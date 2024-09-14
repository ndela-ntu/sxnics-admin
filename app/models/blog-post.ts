import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  author: string;
  coverImage: string;
  coverImagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: { type: String, required: true },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "", // Default empty string if no cover image is provided
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Enable timestamps
);

const BlogPost =
  (mongoose.models && mongoose.models.BlogPost) ||
  mongoose.model("BlogPost", BlogPostSchema);

export default BlogPost;
