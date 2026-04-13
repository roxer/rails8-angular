import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'articles',
    loadComponent: () => import('./components/article-list/article-list').then(m => m.ArticleListComponent)
  },
  {
    path: 'articles/new',
    loadComponent: () => import('./components/article-form/article-form').then(m => m.ArticleFormComponent)
  },
  {
    path: 'articles/:id',
    loadComponent: () => import('./components/article-detail/article-detail').then(m => m.ArticleDetailComponent)
  },
  {
    path: '',
    redirectTo: '/articles',
    pathMatch: 'full'
  }
];
