import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Storage } from '@ionic/storage-angular';
import { StudyTask } from './task-service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private storage: Storage){
    this.storage.create();
  }

  async scheduleNotification(task: StudyTask) {
    const reminderTime = await this.storage.get('reminderTime') || 24;
    const dueDate = new Date (task.dueDate);
    const notifyAt = new Date(dueDate.getTime() - reminderTime * 60 * 60 * 1000);

    await LocalNotifications.schedule({
      notifications: [{
        id: task.id,
        title: 'Task Due Soon',
        body: `${task.title} is due soon!`,
        schedule: {at: notifyAt}
      }]
    });
   }

   async cancelNotification(taskId: number) {
    await LocalNotifications.cancel({
      notifications: [{id: taskId}]
    });
   }

   async rescheduleAll(tasks: StudyTask[], reminderTime: number){
     for(const task of tasks){
      await this.cancelNotification(task.id);
     }
     await this.storage.set(`reminderTime`,reminderTime);
     for(const task of tasks){
      await this.scheduleNotification(task);
     }
   }
}
