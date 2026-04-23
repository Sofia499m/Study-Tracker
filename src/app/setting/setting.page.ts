import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonListHeader, IonList } from '@ionic/angular/standalone';
import { NotificationService } from '../Services/notification-service';
import { TaskService } from '../Services/task-service';
import { Storage } from '@ionic/storage-angular';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonListHeader, IonList ]
})
export class SettingPage {
  notificationTime: string = '09:00';
  reminderTime: number = 24;
  isDarkMode: boolean =false;
  notificationsEnabled: boolean = false;
  constructor(
    private storage: Storage, 
    private taskService: TaskService, 
    private notificationService: NotificationService) { 
    }

  async ionViewWillEnter(){
    await this.storage.create();
    this.reminderTime = await this.storage.get('reminderTime') || 24;
    this.isDarkMode = await this.storage.get('darkMode') || false;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    this.notificationsEnabled = await this.storage.get('notificationsEnabled');
    this.notificationTime = await this.storage.get('notificationTime') || '09:00';
  }

  async onNotificationTimeChange(){
    await this.storage.set('notificationTime', this.notificationTime);
    console.log('Notification time set to:', this.notificationTime);

    const tasks = await firstValueFrom(this.taskService.Tasks$);
    await this.notificationService.rescheduleAll(tasks, this.reminderTime);
  }
  async onReminderChange(){
    const tasks = await firstValueFrom(this.taskService.Tasks$);
    await this.notificationService.rescheduleAll(tasks, this.reminderTime);
  }
  async onThemeChange(){
    console.log('toggle changed, isDarkMode:', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    await this.storage.set('darkMode', this.isDarkMode);
  }
  async onNotificationToggled(){
    await this.storage.set('notificationsEnabled', this.notificationsEnabled);

    if(!this.notificationsEnabled){
      const tasks = await firstValueFrom(this.taskService.Tasks$);
      for (const task of tasks){
        await this.notificationService.cancelNotification(task.id);
      }
    }else{
      const tasks = await firstValueFrom(this.taskService.Tasks$);
      for(const task of tasks){
        await this.notificationService.scheduleNotification(task);
      }
    }
  }
}
