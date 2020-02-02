import moment from 'moment-timezone';

export interface ITask {
  name: string;
  dueAt: moment.Moment;
}

export class Task implements ITask {
  public name = "";
  public dueAt;

  constructor() {
    const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.dueAt = moment.tz(timezone).hour(17).startOf('hour');
  }
}