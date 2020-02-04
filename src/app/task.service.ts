import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import moment from 'moment-timezone';
import { ITask, Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private storage: Storage) { }

  convertTaskDatesToMoment(task) {
    for (let key in task) {
      if (Array.isArray(task[key])) {
        let index = 0;
        for (let element of task[key]) {
          task[key][index] = this.convertDateFieldToMoment(element);
          index++;
        }
      } else {
        task[key] = this.convertDateFieldToMoment(task[key]);
      }
    }
    return task;
  }

  convertDateFieldToMoment(field) {
    if (moment(field, moment.ISO_8601, true).isValid()) {
      return moment(field);
    }
    return field;
  }

  convertTaskDatesToString(task) {
    for (let key in task) {
      if (Array.isArray(task[key])) {
        let index = 0;
        for (let element of task[key]) {
          task[key][index] = this.convertDateFieldToString(element);
          index++;
        }
      } else {
        task[key] = this.convertDateFieldToString(task[key]);
      }
    }
    return task;
  }

  convertDateFieldToString(field) {
    if (field && typeof field == 'object' && field._isAMomentObject) {
      return field.format();
    }
    return field;
  }

  convertToTask(task) {
    let data = this.convertTaskDatesToMoment(task);
    return new Task(data);
  }

  async fetchTasks() {
    let tasks: Array<ITask> = await this.storage.get('tasks');
    if (!tasks) {
      tasks = [];
    }
    return tasks.map((task) => this.convertToTask(task));
  }

  async createTask(task) {
    if (!task || !task.name || task.name.trim().length == 0) {
      console.log('TODO: alert: Please add a name for the task!')
      return;
    }
    if (!task.dueAt) {
      console.log('TODO: alert: Please enter a due date/time for the task!')
    }
    if (task.dueAt < moment()) {
      console.log('TODO: alert: The task date/time can\'t be in the past!')
    }
    let tasks = await this.storage.get('tasks');
    if (!tasks || !Array.isArray(tasks)) {
      tasks = [];
    }
    let newTaskId = 1;
    if (tasks.length > 0) {
      newTaskId = tasks[tasks.length - 1].id + 1;
    }
    let _task = new Task(task);
    _task = this.convertTaskDatesToString(_task);
    _task.id = newTaskId;
    _task.originalDueAt = _task.dueAt
    tasks.push(_task);
    try {
      await this.storage.set('tasks', tasks);
    }
    catch (err) {
      console.log(err);
    }
    return _task;
  }

  async markTaskComplete(task) {
    const tasks: Array<any> = await this.storage.get('tasks');
    let taskIndex = tasks.findIndex(_task => _task.id && task.id && task.id == _task.id);
    if (taskIndex != -1) {
      let updatedTask = tasks[taskIndex];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      updatedTask.isComplete = true;
      updatedTask.completedAt = moment.tz(timezone);
      tasks[taskIndex] = this.convertTaskDatesToString(updatedTask);
      await this.storage.set('tasks', tasks);
    } else {
      console.log('Could not find task:');
      console.log(task);
    }
  }

  async snoozeTask(task) {
    const tasks: Array<any> = await this.storage.get('tasks');
    let taskIndex = tasks.findIndex(_task => _task.id && task.id && task.id == _task.id);
    if (taskIndex != -1) {
      let updatedTask = tasks[taskIndex];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = moment.tz(timezone);
      updatedTask.snoozes.push(now);
      tasks[taskIndex].dueAt = task.dueAt.add(1, 'day')
      tasks[taskIndex] = this.convertTaskDatesToString(updatedTask);
      await this.storage.set('tasks', tasks);
    } else {
      console.log('Could not find task:');
      console.log(task);
    }
  }

}
