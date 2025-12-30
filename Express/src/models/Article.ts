import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  original_content: string;
  updated_content: string | null;
  source_url: string;
  references: string[];
  created_at: Date;
}

const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  original_content: {
    type: String,
    required: true
  },
  updated_content: {
    type: String,
    default: null
  },
  source_url: {
    type: String,
    required: true,
    unique: true
  },
  references: {
    type: [String],
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
