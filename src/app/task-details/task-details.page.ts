import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonInput, IonItem, IonList, IonCardContent, IonDatetime, IonText, IonLabel, IonSelect, IonSelectOption, IonModal, IonIcon } from '@ionic/angular/standalone';
import { TaskService, StudyTask, Steps } from '../Services/task-service';
import { Router, ActivatedRoute } from '@angular/router'
import { addIcons } from 'ionicons';
import { trashOutline, pencilOutline, checkmarkCircle, add } from 'ionicons/icons';
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonButton, IonInput, IonItem, IonList, IonCardContent, IonDatetime, IonText, IonLabel, IonSelect, IonSelectOption, IonModal, IonIcon]
})
export class TaskDetailsPage implements OnInit {

  isEditMode = false;
  taskId: number | null = null;
  newStepsDescription = '';
  showDate = false;

  task = {
    title: '',
    dedication: '',
    dueDate: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    steps: [] as Steps[]
  };

  private nextStep = 1;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService) {
      addIcons({add,trashOutline,pencilOutline,checkmarkCircle});
  }
  showNewToDoInput = false;
  toggleInput() { this.showNewToDoInput = !this.showNewToDoInput; }
  AddToDo() {
    if (!this.newStepsDescription.trim()) return;
    this.task.steps.push({
      id: this.nextStep++,
      description: this.newStepsDescription,
      completed: false,
    });
    this.newStepsDescription = '';
  }
  toggleToDoItem(item: Steps) { item.completed = !item.completed; }
  removeToDoItem(id: number) { this.task.steps = this.task.steps.filter(d => d.id !== id); }
  onDateChange(event: any) { this.task.dueDate = event.detail.value; 

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        const existing = this.taskService.getTaskById(this.taskId);
        if (existing) {
          this.task = {
            title: existing.title,
            dedication: existing.dedication,
            dueDate: existing.dueDate ? new Date(existing.dueDate).toISOString() : '',
            priority: existing.priority || 'low',
            steps : existing.steps || []
          };
          };
        }
      });
  }
  async save(){
    const save: StudyTask = {
      id: this.isEditMode && this.taskId ? this.taskId : Date.now(),
      title: this.task.title,
      dedication: this.task.dedication,
      dueDate: this.task.dueDate,
      priority: this.task.priority,
      steps: this.task.steps
    }
    await this.taskService.saveTask(save);
    this.router.navigate(['/task-list']);
  }
}
