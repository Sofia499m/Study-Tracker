import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonLabel, IonItem, IonBadge, IonCard, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { TaskService, Task } from '../Services/task-service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonDatetime, IonLabel, IonItem, IonBadge, IonCard, IonButtons, IonMenuButton]
})
export class CalendarPage{
  tasks : Task[] = [];
  selectedDate: string = '';
  taskForSelectedDate: Task [] = [];
  selectedPriority: string = '';
  highDates: any[] = [];
  mediumDates: any[] = [];
  lowDates: any[] = [];

  constructor(private taskService:TaskService, private router:Router) { }

  ionViewWillEnter(){
    this.taskService.Tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.buildHighlightedDates();
    });
  }

  buildHighlightedDates(){
    this.highDates = this.getHighlightedDate('high','#eb445a');
    this.mediumDates = this.getHighlightedDate('medium', '#ffc409');
    this.lowDates = this.getHighlightedDate('low','#2dd36f');
  }

  getHighlightedDate(priority: string, color: string): any[] {
    return this.tasks 
    .filter(t => t.priority === priority && t.dueDate)
    .map(t => ({
        date: t.dueDate.split('T')[0],
        textColor: '#ffffff',
        backgroundColor: color
    }));
  }

  onDateChange(event: any, priority: string) {
    this.selectedDate = event.detail.value?.split('T')[0];
    this.selectedPriority = priority;
    this.taskForSelectedDate = this.tasks.filter(t =>
      t.priority === priority &&
      t.dueDate?.startsWith(this.selectedDate)
    );
  }
}
