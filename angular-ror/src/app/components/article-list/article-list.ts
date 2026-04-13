import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { forkJoin, map, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-article-list',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="px-4 py-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Articles</h1>
        <a
          routerLink="/articles/new"
          class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition flex items-center font-medium"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Add New Article
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      }

      @if (!loading() && articles().length === 0) {
        <div
          class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm"
        >
          <svg
            class="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 11v6m0 0l-3-3m3 3l3-3"
            ></path>
          </svg>
          <p class="text-xl font-medium text-gray-900 mb-2">No articles found</p>
          <p>Get started by creating your first article.</p>
        </div>
      }

      @if (!loading() && articles().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (article of articles(); track article) {
            <a
              [routerLink]="['/articles', article.id]"
              class="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 block"
            >
              <h2
                class="text-xl font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
              >
                {{ article.title }}
              </h2>
              <div class="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  {{ article.author }}
                </span>
                @if (article.created_at) {
                  <span class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {{ article.created_at | date: 'mediumDate' }}
                  </span>
                }
              </div>
              <p class="text-gray-600 line-clamp-3 leading-relaxed mb-4">{{ article.body }}</p>
              <div class="flex items-center text-sm font-medium text-indigo-600">
                <svg
                  class="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                {{ article.comments_count !== undefined ? article.comments_count : 0 }} Comments
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ArticleListComponent implements OnInit {
  private articleService = inject(ArticleService);
  articles = signal<Article[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.articleService
      .getArticles()
      .pipe(
        switchMap((articles) => {
          if (!articles || articles.length === 0) {
            return of([]);
          }

          const requests = articles.map((article) =>
            this.articleService.getComments(article.id!.toString()).pipe(
              map((comments) => ({ ...article, comments_count: comments.length })),
              catchError(() => of({ ...article, comments_count: 0 })),
            ),
          );

          return forkJoin(requests);
        }),
      )
      .subscribe({
        next: (data) => {
          this.articles.set(data as Article[]);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load articles', err);
          this.loading.set(false);
        },
      });
  }
}
