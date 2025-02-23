/**
 * Represents time as hours and minutes.
 */
export class Time {

  /** The hour component of the time (0-23). */
  Hours: number;

  /** The minute component of the time (0-59). */
  Minutes: number;

  /**
   * Creates an instance of the Time class.
   * @param hour - The hour component of the time (0-23).
   * @param minutes - The minute component of the time (0-59).
   */
  constructor(hour: number, minutes: number) {
    this.Hours = hour;
    this.Minutes = minutes;
  }

  /**
   * Converts time to an integer as total number of minutes since midnight.
   * @returns - The total number of minutes since midnight.
   */
  toInt(): number {
    return this.Hours*60 + this.Minutes;
  }

  /**
   * Converts time to a string in the format `HH:mm`.
   * @returns - The time as a string in `HH:mm` format.
   */
  toString(): string {
    return `${this.Hours < 10 ? '0' + String(this.Hours) :String( this.Hours)}:${this.Minutes < 10 ? '0' + String(this.Minutes): String(this.Minutes)}`;
  }
}

/**
 * Converts a `Date` object to a `Time` object.
 * @param date - The `Date` object to convert.
 * @returns - The `Time` object representing the same time as the provided parameter `date`.
 */
export const TimeFromDate = (date: Date): Time => {
  return new Time(date.getHours(), date.getMinutes());
};

/**
 * Array containing the abbreviated names of the days of the week.
 * @example
 * ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
 */
export const DaysOfWeekNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default Time;