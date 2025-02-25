export class Event {
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    latitude: number;
    longitude: number;
    transportationMode: string;
    workflow: number|null;
    constructor(name: string, description: string, startTime: string, endTime: string, latitude: number ,longitude: number ,transportationMode: string, workflow: number|null){
        this.id=0;
        this.name=name;
        this.description=description;
        this.startTime=startTime;
        this.endTime=endTime;
        this.latitude=latitude;
        this.longitude=longitude;
        this.transportationMode=transportationMode;
        this.workflow=workflow;
    }
    
};