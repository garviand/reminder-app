import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import moment from 'moment-timezone';
import { ITask, Task } from '../task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: 'create-task.html',
  styleUrls: ['create-task.scss']
})
export class CreateTaskPage implements OnInit {

  public task: ITask = new Task();
  public timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public now: moment.Moment = moment.tz(this.timezone);
  public day: string = 'today';
  public isInPast: boolean = false;

  constructor(
    private taskService: TaskService
  ) {}

  ngOnInit() {
    if (this.task.dueAt < this.now) {
      this.task.dueAt.add(1, 'day');
      this.day = 'tomorrow';
    }
  }

  checkInPast() {
    this.isInPast = this.task.dueAt < this.now;
  }

  updateTime(event) {
    let time = moment.tz(event.target.value, this.timezone);
    this.task.dueAt.hour(time.hour()).minute(time.minute()).startOf('minute');
  }

  changeDay(event) {
    this.day = event.target.value;
    let time = moment.tz(this.timezone);
    if (this.day === 'tomorrow') {
      time.add(1, 'day');
    }
    time.hour(this.task.dueAt.hour());
    time.minute(this.task.dueAt.minute());
    time.startOf('minute');
    this.task.dueAt = time;
  }

  async createTask() {
    await this.taskService.createTask(this.task);
  }

  

}
