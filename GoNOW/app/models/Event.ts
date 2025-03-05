import Coordinates from "./Location";


export interface Event {
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    coordinates: Coordinates
    transportationMode: string;
    workflow: number|null;
}