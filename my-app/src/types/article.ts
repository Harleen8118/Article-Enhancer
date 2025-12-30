export interface Article {
  _id: string;
  title: string;
  original_content: string;
  updated_content: string | null;
  source_url: string;
  references: string[];
  created_at: string;
}
