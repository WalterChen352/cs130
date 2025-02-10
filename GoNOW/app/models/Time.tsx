export class Time {
    Hours: number;
    Minutes: number;

    constructor(minutes: number) {
        this.Hours = Math.floor(minutes / 60);
        this.Minutes = minutes % 60;
    }

    toInt(): number {
        return this.Hours*60 + this.Minutes;
    }

    toString(): string {
        return `${this.Hours}:${this.Minutes}`;
    }
}

export const DaysOfWeekNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];