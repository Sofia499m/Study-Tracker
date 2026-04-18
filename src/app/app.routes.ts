import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'task-list',
    loadComponent: () => import('./task-list/task-list.page').then( m => m.TaskListPage)
  },
  {
    path: 'task-details',
    loadComponent: () => import('./task-details/task-details.page').then( m => m.TaskDetailsPage)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.page').then( m => m.CalendarPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'setting',
    loadComponent: () => import('./setting/setting.page').then( m => m.SettingPage)
  },
  {
    path: 'task-list',
    loadComponent: () => import('./task-list/task-list.page').then( m => m.TaskListPage)
  },
  {
    path: 'task-details',
    loadComponent: () => import('./task-details/task-details.page').then( m => m.TaskDetailsPage)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.page').then( m => m.CalendarPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'setting',
    loadComponent: () => import('./setting/setting.page').then( m => m.SettingPage)
  },
];
