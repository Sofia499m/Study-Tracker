import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButtons, IonMenuButton, IonTitle, IonToolbar, IonCardContent, IonCard, IonCardHeader, IonLabel, IonCheckbox, IonModal, IonItem, IonProgressBar, IonList, IonIcon, IonButton, IonFabButton, IonFab, IonBadge } from '@ionic/angular/standalone';
import { TaskService, StudyTask } from '../Services/task-service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { trashOutline, pencilOutline, chevronUpOutline, chevronDownOutline, addOutline, add } from 'ionicons/icons';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonButtons, IonMenuButton, IonTitle, IonToolbar, CommonModule, FormsModule, IonCardContent, IonCard, IonCardHeader, IonLabel, IonCheckbox, IonModal, IonItem, IonProgressBar, IonList, IonIcon, IonButton, IonFabButton, IonFab, IonBadge]
})
export class TaskListPage{
  tasks : StudyTask [] = [];
  expandedId: number | null = null;
  constructor(
    private router: Router,
    private taskService: TaskService
  ) { 
    addIcons({pencilOutline,trashOutline,add,chevronUpOutline,chevronDownOutline,addOutline});
  }
  async ionViewWillEnter() {
    this.taskService.Tasks$.subscribe(tasks => this.tasks = tasks);
  }
  stepToggleExpand(id: number){
    this.expandedId = this.expandedId === id ? null : id;
  }
  get completeCount(): number{
    const task = this.tasks.find(t => t.id === this.expandedId);
    return task?.steps.filter(s => s.completed).length ?? 0;
  }
  progressCount(task: StudyTask): number {
    if (!task.steps.length) return 0;
    return task.steps.filter(s => s.completed).length / task.steps.length;
  }
  goToEdit(task: StudyTask) {
    this.router.navigate(['/task-details'], { queryParams: { id: task.id } });
  }
  
  addTask() {
    this.router.navigate(['/task-details']);
  }
  
  async deleteTask(id: number) {
    await this.taskService.deleteTask(id);
  }
  
  async stepToggle(task: StudyTask) {
    await this.taskService.saveTask(task);
    setTimeout(async () => {
      await this.taskService.deleteTask(task.id);
    }, 500);
  }
  priorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';   
      case 'medium': return 'warning'; 
      case 'low': return 'success';  
      default: return 'medium';
    }
  }
}
