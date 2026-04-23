import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Storage } from '@ionic/storage-angular';
import { StudyTask } from './task-service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private storageReady: Promise<Storage>;
  constructor(private storage: Storage){
    this.storageReady = this.storage.create(); 
    this.setupForegroundNotifications();
  }

  async setupForegroundNotifications() {
    await LocalNotifications.registerActionTypes({
      types: [{ id: 'CHAT_MSG', actions: [] }] 
    });
  }

  async scheduleNotification(task: StudyTask) {
    const store = await this.storageReady;

    const notificationsEnabled = await store.get('notificationsEnabled');
    if (!notificationsEnabled) return;

    const reminderTime: number = (await store.get('reminderTime')) ?? 24;
    const notificationTime: string = (await store.get('notificationTime')) ?? '09:00';
    const [hour, minute] = notificationTime.split(':').map(Number);

    const dueDate = new Date (task.dueDate);

    const notifyDate = new Date(dueDate);
    notifyDate.setDate(dueDate.getDate() - Math.round(reminderTime / 24));
    notifyDate.setHours(hour, minute, 0, 0);

    console.log('Due date:', dueDate);
    console.log('Notify at:', notifyDate);

    if (notifyDate <= new Date()) {
      console.log('In the past, skipping:', task.title);
      return;
    }

    console.log("task id: "+task.id)

    await LocalNotifications.schedule({
      notifications: [{
        id: task.id,
        title: 'Task Due Soon',
        body: `"${task.title}" is due soon!`,
        schedule: { at: notifyDate },
      }]
    });
    console.log('Scheduled:', task.title, 'at', notifyDate);
   }

   async cancelNotification(taskId: number): Promise<void> {
    await LocalNotifications.cancel({
      notifications: [{id: taskId}]
    });
   }

   async rescheduleAll(tasks: StudyTask[]): Promise<void>{
     for(const task of tasks){
      await this.cancelNotification(task.id);
     }
     for(const task of tasks){
      await this.scheduleNotification(task);
     }
   }
}
