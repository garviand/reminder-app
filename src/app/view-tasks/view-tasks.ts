import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import moment from 'moment-timezone';
import { ITask } from '../task';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.html',
  styleUrls: ['./view-tasks.scss'],
})
export class ViewTasksPage implements OnInit {

  tasks: Array<ITask> = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(async () => {
      this.tasks = await this.fetchTasks();
      console.log(this.tasks)
    });
  }

  async fetchTasks() {
    return await this.taskService.fetchTasks();
  }

  async markTaskComplete(task) {
    let tasks = await this.taskService.markTaskComplete(task);
    console.log ('TODO: alert: Task has been marked as complete!')
  }

  async snoozeTask(task) {
    let tasks = await this.taskService.snoozeTask(task);
    console.log ('TODO: alert: Task has been marked as snoozed!')
  }

  async toggleTaskActions(actions) {
    const openAmount = await actions.getOpenAmount();
    if (openAmount <= 70) {
      actions.open();
      actions.isOpen = true;
    } else {
      actions.closeOpened();
      actions.isOpen = false;
    }
  }

  async updateTaskActionStatus(actions) {
    const openAmount = await actions.getOpenAmount();
    if (openAmount >= 70) {
      actions.isOpen = true;
    } else {
      actions.isOpen = false;
    }
  }

  getProgressDisplay(task) {
    if (task.isComplete) {
      return 'Done!';
    }
    if (task.dueAt < moment()) {
      return 'Past Due..';
    }
    return 'In Progress';
  }

  getTimeRemainingDisplay(task) {
    const now = moment()
    const daysLeft = task.dueAt.diff(now, 'days')
    if (task.isComplete) {
      const daysSinceComplete = task.completedAt.diff(now, 'days')
      if (daysSinceComplete == 0) {
        return `Finished at ${task.completedAt.format('h:mma')}`
      }
      return `Finished on ${task.completedAt.format('M/DD')} at ${task.completedAt.format('h:mma')}`
    }
    if (daysLeft == 1) {
      return `Due Tomorrow at <b>${task.dueAt.format('h:mma')}</b>`
    }
    if (daysLeft > 1) {
      return `Due in ${daysLeft} days at <b>${task.dueAt.format('h:mma')}</b>`
    }
    const hoursLeft = task.dueAt.diff(now, 'hours') % 24
    if (hoursLeft > 0) {
      return `Due in ${hoursLeft} hours at <b>${task.dueAt.format('h:mma')}</b>`
    }
    const minutesLeft = task.dueAt.diff(now, 'minutes') % 60
    if (minutesLeft > 0) {
      return `Due in ${minutesLeft} hours at <b>${task.dueAt.format('h:mma')}</b>`
    }
    if (daysLeft == 0) {
      return `This was due today at <b>${task.dueAt.format('h:mma')}</b>`
    }
    if (daysLeft == -1) {
      return `This was due today at <b>${task.dueAt.format('h:mma')}</b>`
    }
    if (daysLeft < -1) {
      return `This was due ${Math.abs(daysLeft)} days ago at <b>${task.dueAt.format('h:mma')}</b>`
    }
    return '';
  }

}
