import Coordinates from "./Location";


export class Event {
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    coordinates: Coordinates
    transportationMode: string;
    workflow: number|null;
    constructor(name: string, description: string, startTime: string, endTime: string, coordinates:Coordinates ,transportationMode: string, workflow: number|null){
        this.id=0;
        this.name=name;
        this.description=description;
        this.startTime=startTime;
        this.endTime=endTime;
        this.coordinates=coordinates
        this.transportationMode=transportationMode;
        this.workflow=workflow;
    }
    
};