export type Event = {
    id: number;
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    latitude: number;
    longitude: number;
    transportationMode?: string;
    workflow?: string;
};
