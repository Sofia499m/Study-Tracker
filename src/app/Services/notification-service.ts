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
    const permission = await LocalNotifications.requestPermissions();
    console.log('Permission status:', permission.display);

    const reminderTime = await this.storage.get('reminderTime') || 24;
    console.log('Reminder time:', reminderTime); 

    const notificationTime = await this.storage.get('notificationTime') || '09:00';
    const [hour, minute] = notificationTime.split(':').map(Number);
    console.log('User chosen time:', hour, minute);

    const dueDate = new Date (task.dueDate);
    const notifyAt = new Date(dueDate.getTime() - reminderTime * 60 * 60 * 1000);

    notifyAt.setHours(hour, minute, 0, 0);
    console.log('Notify at:', notifyAt);
    console.log('Current time:', new Date());

    console.log('Notify at:', notifyAt); 
    console.log('Current time:', new Date()); 

    if(notifyAt <= new Date()){
      console.log('Notification time is in the past!'); 
      return;
    }

    await LocalNotifications.schedule({
      notifications: [{
        id: task.id,
        title: 'Task Due Soon',
        body: `${task.title} is due soon!`,
        schedule: {at: notifyAt}
      }]
    });
    console.log('Notification scheduled for:', task.title, 'at', notifyAt);
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
