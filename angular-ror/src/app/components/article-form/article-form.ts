import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="px-4 py-8 max-w-3xl mx-auto">
      <div class="mb-8">
        <a
          routerLink="/articles"
          class="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium mb-4 transition-colors"
        >
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Articles
        </a>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Create New Article</h1>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form [formGroup]="articleForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              [class.border-red-500]="isFieldInvalid('title')"
              placeholder="Enter article title"
            />
            @if (isFieldInvalid('title')) {
              <div class="mt-1 text-sm text-red-500">Title is required.</div>
            }
          </div>

          <div>
            <label for="author" class="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              id="author"
              formControlName="author"
              class="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              [class.border-red-500]="isFieldInvalid('author')"
              placeholder="Enter author's name"
            />
            @if (isFieldInvalid('author')) {
              <div class="mt-1 text-sm text-red-500">Author is required.</div>
            }
          </div>

          <div>
            <label for="body" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="body"
              formControlName="body"
              rows="6"
              class="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y"
              [class.border-red-500]="isFieldInvalid('body')"
              placeholder="Write your article content here..."
            ></textarea>
            @if (isFieldInvalid('body')) {
              <div class="mt-1 text-sm text-red-500">Content is required.</div>
            }
          </div>

          <div class="pt-4 flex justify-end">
            <button
              type="button"
              routerLink="/articles"
              class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 mr-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="articleForm.invalid || submitting"
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
              {{ submitting ? 'Saving...' : 'Save Article' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class ArticleFormComponent {
  private fb = inject(FormBuilder);
  private articleService = inject(ArticleService);
  private router = inject(Router);

  articleForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    body: ['', Validators.required],
  });

  submitting = false;

  isFieldInvalid(fieldName: string): boolean {
    const field = this.articleForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.articleService.createArticle(this.articleForm.value as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/articles']);
      },
      error: (err) => {
        console.error('Failed to create article', err);
        this.submitting = false;
        // Ideally add a toast or error message here
      },
    });
  }
}
