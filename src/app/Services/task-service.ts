import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Storage } from '@ionic/storage-angular'
export interface StudyTask {
  id: number;
  title: string;
  dueDate: string;
  dedication: string;
  priority: 'low' | 'medium' | 'high';
  steps: Steps [];
}
export interface Steps{
  id: number;
  description: string;
  completed: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private taskSubject = new BehaviorSubject<StudyTask[]>([]);
  Tasks$ = this.taskSubject.asObservable();

  constructor(private storage: Storage){
    this.storage.create().then(()=> this.load());
  }

  private async load() {
    const tasks: StudyTask[] = (await this.storage.get('tasks')) || [];
    this.taskSubject.next(tasks);
  }

  async getTaskByIdFromStorage(id: number): Promise<StudyTask | undefined>{
    const tasks: StudyTask[] = (await this.storage.get('tasks')) || [];
    return tasks.find(t => t.id === id);
  }
  getTaskById(id: number): StudyTask | undefined {
    return this.taskSubject.value.find(t => t.id === id); 
  }

  async saveTask (task: StudyTask): Promise<void> {
    const tasks = [...this.taskSubject.value];
    const index = tasks.findIndex(t => t.id === task.id);
    index > -1 ? (tasks[index] = task) : tasks.push(task);
    await this.storage.set('tasks', tasks);
    this.taskSubject.next(tasks);
  }

  async deleteTask(id:number): Promise<void> {
    const tasks = this.taskSubject.value.filter(t => t.id !== id);
    await this.storage.set('tasks', tasks);
    this.taskSubject.next(tasks);
  }
}
