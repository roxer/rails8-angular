import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { Article, ArticlePayload } from '../models/article';
import { Comment, CommentPayload } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/articles';

  globalStats = signal({ articles: 0, comments: 0 });

  refreshStats() {
    this.getArticles().pipe(
      switchMap(articles => {
        if (!articles || articles.length === 0) {
          return of({ articles: 0, comments: 0 });
        }
        const requests = articles.map(article =>
          this.getComments(article.id!.toString()).pipe(
            map(comments => comments.length),
            catchError(() => of(0))
          )
        );
        return forkJoin(requests).pipe(
          map(counts => {
            const comments = counts.reduce((acc, count) => acc + count, 0);
            return { articles: articles.length, comments };
          })
        );
      })
    ).subscribe({
      next: (stats) => this.globalStats.set(stats),
      error: (err) => console.error('Failed to load global stats', err)
    });
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  createArticle(article: Article): Observable<Article> {
    const payload: ArticlePayload = { article };
    return this.http.post<Article>(this.apiUrl, payload).pipe(
      tap(() => this.refreshStats())
    );
  }

  getComments(articleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${articleId}/comments`);
  }

  createComment(articleId: string, comment: Comment): Observable<Comment> {
    const payload: CommentPayload = {
      comment: { body: comment.body, author: comment.author }
    };
    return this.http.post<Comment>(`${this.apiUrl}/${articleId}/comments`, payload).pipe(
      tap(() => this.refreshStats())
    );
  }
}
