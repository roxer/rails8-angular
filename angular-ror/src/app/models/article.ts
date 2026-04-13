export interface Article {
  id?: number | string;
  title: string;
  author: string;
  body: string;
  created_at?: string;
  updated_at?: string;
  comments_count?: number;
}

export interface ArticlePayload {
  article: {
    title: string;
    author: string;
    body: string;
  };
}
