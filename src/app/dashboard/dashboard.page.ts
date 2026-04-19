import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCard, IonLabel, IonItem, IonList, IonButton, IonText, IonCardContent, IonIcon, IonCardTitle, IonCardHeader, IonCol, IonRow, IonGrid, IonBadge } from '@ionic/angular/standalone';
import { TaskService, StudyTask } from '../Services/task-service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { sunnyOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonLabel, IonItem, IonList, RouterLink, IonButton, IonText, IonCardContent, IonIcon, IonCardTitle, IonCardHeader, IonCol, IonRow, IonGrid, IonBadge]
})
export class DashboardPage implements OnInit, OnDestroy {

  tasks: StudyTask[] = [];
  private sub!: Subscription;
  wish: string = '';
  constructor(private taskService: TaskService, private http: HttpClient) {
    addIcons({ sunnyOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.sub = this.taskService.Tasks$.subscribe(tasks => { this.tasks = tasks; })
    this.http.get<{ message: string }>('https://apistudy-tracker.onrender.com/wish')
      .subscribe(data => {
        this.wish = data.message;
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  get totalTask(): number {
    return this.tasks.length;
  }
  get completedTask(): number {
    return this.tasks.filter(t => this.getStepProgress(t) === 100).length;
  }
  get dueTodayTask(): StudyTask[] {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.dueDate.split('T')[0] === today);
  }
  get upcomingTask(): StudyTask[] {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks
      .filter(t => t.dueDate.split('T')[0] && this.getStepProgress(t) < 100)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }
  getStepProgress(task: StudyTask): number {
    if (!task.steps || task.steps.length === 0) return 0;
    const done = task.steps.filter(s => s.completed).length;
    return Math.round((done / task.steps.length) * 100);
  }

  getCompletedSteps(tasks: StudyTask): number {
    return tasks.steps?.filter(s => s.completed).length || 0;
  }

  getDaysUntilDue(dueDates: string): number {
    if (!dueDates) return 0;

    const datePart = dueDates.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);

    if (!year || !month || !day) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(year, month - 1, day);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDueLabel(dueDate: string): string {
    const days = this.getDaysUntilDue(dueDate);
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due Today';
    if (days === 1) return 'Due Tomorrow';
    return `Due in ${days} days`;
  }

  getDueColor(dueData: string): string {
    const days = this.getDaysUntilDue(dueData);
    if (days < 0) return 'danger';
    if (days <= 1) return 'warning';
    return 'success';
  }

  getPriorityColor(priority: string): string {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'success';
  }
}
