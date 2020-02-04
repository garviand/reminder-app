import moment from 'moment-timezone';
import { ModuleWithComponentFactories } from '@angular/core';

export interface ITask {
  id: number;
  name: string;
  dueAt: moment.Moment;
  originalDueAt: moment.Moment;
  snoozes: Array<moment.Moment>;
  isDeleted: boolean;
  deletedAt: moment.Moment;
  isComplete: boolean;
  completedAt: moment.Moment;
}

export class Task implements ITask {
  public id: number;
  public name: string;
  public dueAt: moment.Moment;
  public originalDueAt: moment.Moment;
  public snoozes: Array<moment.Moment>;
  public isDeleted: boolean;
  public deletedAt: moment.Moment;
  public isComplete: boolean;
  public completedAt: moment.Moment;

  constructor(params?) {
    if (!params) {
      params = {};
    }
    const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.id = params.id || null;
    this.name = params.name || '';
    this.dueAt = params.dueAt || moment.tz(timezone).hour(17).startOf('hour');
    this.originalDueAt = params.originalDueAt || null;
    this.snoozes = params.snoozes || [];
    this.isDeleted = params.isDeleted || false;
    this.deletedAt = params.deletedAt || null;
    this.isComplete = params.isComplete || false;
    this.completedAt = params.completedAt || null;
  }
}