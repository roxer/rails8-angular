import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleService } from './services/article.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.css',
  template: `
    <main class="min-h-screen bg-gray-50 font-sans">
      <header class="bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg
              class="w-8 h-8 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 2v4M8 2v4M3 10h18"
              ></path>
            </svg>
            <span class="font-bold text-xl text-gray-900 tracking-tight">Elearnio Articles</span>
          </div>

          <div class="flex gap-4 text-sm font-medium text-gray-600 items-center">
            <div
              class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
            >
              <svg
                class="w-4 h-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
                ></path>
              </svg>
              {{ articleService.globalStats().articles }} Articles
            </div>
            <div
              class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
            >
              <svg
                class="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              {{ articleService.globalStats().comments }} Comments
            </div>
          </div>
        </div>
      </header>
      <section class="content mt-4">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
})
export class App implements OnInit {
  articleService = inject(ArticleService);

  ngOnInit() {
    this.articleService.refreshStats();
  }
}
