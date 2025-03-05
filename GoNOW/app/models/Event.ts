import Coordinates from "./Location";


export type Event ={
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    coordinates: Coordinates
    transportationMode: string;
    workflow: number|null;
};