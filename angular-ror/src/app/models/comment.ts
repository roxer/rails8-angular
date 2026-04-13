export interface Comment {
  id?: number | string;
  body: string;
  author: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommentPayload {
  comment: {
    body: string;
    author: string;
  };
}
