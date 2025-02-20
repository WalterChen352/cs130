export class Time {
  Hours: number;
  Minutes: number;
  constructor(hour: number, minutes: number) {
    this.Hours = hour;
    this.Minutes = minutes;
  }
  toInt(): number {
    return this.Hours*60 + this.Minutes;
  }
  toString(): string {
    return `${this.Hours < 10 ? '0' + String(this.Hours) :String( this.Hours)}:${this.Minutes < 10 ? '0' + String(this.Minutes): String(this.Minutes)}`;
  }
}

export const TimeFromDate = (date: Date): Time => {
  return new Time(date.getHours(), date.getMinutes());
};

export const DaysOfWeekNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default Time;