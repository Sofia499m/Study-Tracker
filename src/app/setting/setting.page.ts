import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonListHeader, IonList } from '@ionic/angular/standalone';
import { NotificationService } from '../Services/notification-service';
import { TaskService } from '../Services/task-service';
import { Storage } from '@ionic/storage-angular';
import { firstValueFrom } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';
// import { Capacitor } from '@capacitor/core';
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

  private isLoading = true;

  constructor(
    private storage: Storage, 
    private taskService: TaskService, 
    private notificationService: NotificationService) { 
    }

  async ionViewWillEnter(){
    this.isLoading = true;

    const store = await this.storage.create();
    this.reminderTime = (await store.get('reminderTime')) ?? 24;
    this.notificationTime = (await store.get('notificationTime')) ?? '09:00';
    this.isDarkMode = (await store.get('darkMode')) ?? false;
    this.notificationsEnabled = (await store.get('notificationsEnabled')) ?? false;

    document.documentElement.classList.toggle('dark', this.isDarkMode);

    setTimeout(() => { this.isLoading = false; }, 300);
  }

  async onNotificationTimeChange() {
    if (this.isLoading) return;
    const store = await this.storage.create();
    await store.set('notificationTime', this.notificationTime); 
    const tasks = await firstValueFrom(this.taskService.Tasks$);
    await this.notificationService.rescheduleAll(tasks);        
  }
  async onReminderChange() {
    if (this.isLoading) return;
    const store = await this.storage.create();
    await store.set('reminderTime', this.reminderTime); 
    const tasks = await firstValueFrom(this.taskService.Tasks$);
    await this.notificationService.rescheduleAll(tasks);
  }
  async onThemeChange(){
    console.log('toggle changed, isDarkMode:', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    await this.storage.set('darkMode', this.isDarkMode);
  }
  async onNotificationToggled(){
    await this.storage.set('notificationsEnabled', this.notificationsEnabled);

    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      if(this.notificationsEnabled){
        const tasks = await firstValueFrom(this.taskService.Tasks$);
        for(const task of tasks){
          await this.notificationService.scheduleNotification(task);
        }
      }else{
        const tasks = await firstValueFrom(this.taskService.Tasks$);
        for (const task of tasks){
          await this.notificationService.cancelNotification(task.id);
        }
      }
    } 
  }
}
