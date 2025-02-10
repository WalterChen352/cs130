export class SchedulingStyle {
    Id: number;
    Name: string;

    constructor(id: number, name: string) {
        this.Id = id;
        this.Name = name;
    }
}

export const SchedulingStyles = [
    new SchedulingStyle(0, "Schedule close together"),
    new SchedulingStyle(1, "Schedule with max buffer")
];

export const FindSchedulingStyleById = (id: number) => {
    for (let i=0; i < SchedulingStyles.length; i++) {
        if (SchedulingStyles[i].Id === id)
            return SchedulingStyles[i];
    }
    return SchedulingStyles[0]; // default value
}