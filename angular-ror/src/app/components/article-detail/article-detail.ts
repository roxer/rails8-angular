import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-article-detail',
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  template: `
    <div class="px-4 py-8 max-w-4xl mx-auto">
      <div class="mb-6">
        <a
          routerLink="/articles"
          class="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium mb-6 transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Articles
        </a>
      </div>

      @if (loadingArticle()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      }

      @if (article(); as art) {
        <div>
          <article class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h1 class="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {{ art.title }}
            </h1>
            <div
              class="flex items-center text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100 space-x-6"
            >
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                {{ art.author }}
              </span>
              @if (art.created_at) {
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {{ art.created_at | date: 'longDate' }}
                </span>
              }
            </div>
            <div class="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {{ art.body }}
            </div>
          </article>
          <!-- Comments Section -->
          <section class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Comments
              <span class="ml-2 bg-indigo-100 text-indigo-700 text-sm py-0.5 px-2.5 rounded-full">{{
                comments().length
              }}</span>
            </h2>
            @if (loadingComments()) {
              <div class="flex justify-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            }
            @if (!loadingComments()) {
              <div class="space-y-6 mb-10">
                @for (comment of comments(); track comment) {
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div class="flex items-center justify-between mb-3">
                      <span class="font-semibold text-gray-900">{{ comment.author }}</span>
                      @if (comment.created_at) {
                        <span class="text-sm text-gray-500">{{
                          comment.created_at | date: 'medium'
                        }}</span>
                      }
                    </div>
                    <p class="text-gray-700 whitespace-pre-wrap">{{ comment.body }}</p>
                  </div>
                }
                @if (comments().length === 0) {
                  <div class="text-gray-500 italic py-4">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                }
              </div>
            }
            <!-- Add Comment Form -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h3 class="text-xl font-bold text-black mb-4">Leave a Reply</h3>
              <form [formGroup]="commentForm" (ngSubmit)="onSubmitComment()" class="space-y-4">
                <div>
                  <label for="author" class="block text-sm font-medium text-gray-700 mb-1"
                    >Name</label
                  >
                  <input
                    type="text"
                    id="author"
                    formControlName="author"
                    class="text-black w-full lg:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    [class.border-red-500]="isFieldInvalid('author')"
                    placeholder="Your name"
                  />
                  @if (isFieldInvalid('author')) {
                    <div class="mt-1 text-sm text-red-500">Name is required.</div>
                  }
                </div>
                <div>
                  <label for="body" class="block text-sm font-medium text-gray-700 mb-1"
                    >Comment</label
                  >
                  <textarea
                    id="body"
                    formControlName="body"
                    rows="4"
                    class="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y"
                    [class.border-red-500]="isFieldInvalid('body')"
                    placeholder="What did you think?"
                  ></textarea>
                  @if (isFieldInvalid('body')) {
                    <div class="mt-1 text-sm text-red-500">Comment is required.</div>
                  }
                </div>
                <div class="pt-2">
                  <button
                    type="submit"
                    [disabled]="commentForm.invalid || submitting"
                    class="px-6 py-2.5 bg-indigo-600 border border-transparent text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                  >
                    @if (submitting) {
                      <svg
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    }
                    {{ submitting ? 'Posting...' : 'Post Comment' }}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      }
    </div>
  `,
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private fb = inject(FormBuilder);

  article = signal<Article | null>(null);
  comments = signal<Comment[]>([]);

  loadingArticle = signal(true);
  loadingComments = signal(true);
  submitting = false;

  articleId = '';

  commentForm = this.fb.group({
    author: ['', Validators.required],
    body: ['', Validators.required],
  });

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.articleId) {
      this.fetchArticle();
      this.fetchComments();
    }
  }

  fetchArticle() {
    this.articleService.getArticle(this.articleId).subscribe({
      next: (data) => {
        this.article.set(data);
        this.loadingArticle.set(false);
      },
      error: (err) => {
        console.error('Failed to load article', err);
        this.loadingArticle.set(false);
      },
    });
  }

  fetchComments() {
    this.articleService.getComments(this.articleId).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.loadingComments.set(false);
      },
      error: (err) => {
        console.error('Failed to load comments', err);
        this.loadingComments.set(false);
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.commentForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmitComment() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const newComment = this.commentForm.value as Comment;

    this.articleService.createComment(this.articleId, newComment).subscribe({
      next: (createdComment) => {
        // Append the new comment to the list
        this.comments.update((curr) => [...curr, createdComment]);
        this.submitting = false;

        // Reset the form
        this.commentForm.reset();
      },
      error: (err) => {
        console.error('Failed to post comment', err);
        this.submitting = false;
      },
    });
  }
}
