import type{ Event, Workflow, Coordinates } from "./types";
import { computeTravelTime } from "./mapsQueries";

export const autoschedule = async(apiKey: string,w: Workflow, events: Event[], coordinates: Coordinates, duration: number, timeZone: string, name: string, description: string, onePerDay:boolean, transportation='DRIVE'): Promise<Event | null> => {
    // Get the current date in the specified timezone
    const now = new Date();
    
    // Generate dates for the next 14 days
    const nextTwoWeeks: Date[] = [];
    for (let i = 0; i < 14; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        nextTwoWeeks.push(date);
    }
    
    // Filter days based on workflow's daysOfWeek setting
    let allowedDates=[];
    if(onePerDay)
        allowedDates = nextTwoWeeks.filter(date => {
        // Convert to the specified timezone to get the correct day of week
        const dateInTZ = new Date(date.toLocaleString('en-US', { timeZone }));
        const dayOfWeek = dateInTZ.getDay();
        return w.daysOfWeek[dayOfWeek];
    }) 
    else
         allowedDates= nextTwoWeeks;
    
    // Filter out days that already have an event for this workflow
    const availableDates = allowedDates.filter(date => {
        // Format date in the specified timezone
        const options: Intl.DateTimeFormatOptions = { 
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const dateStr = date.toLocaleDateString('en-US', options).split('/').reverse().join('-');
        
        return !events.some(event => {
            // Skip events from other workflows
            if (event.workflow !== w.id) return false;
            
            // Check if the event falls on this day in the specified timezone
            const eventStart = new Date(event.startTime);
            const eventDateStr = eventStart.toLocaleDateString('en-US', options).split('/').reverse().join('-');
            
            return eventDateStr === dateStr;
        });
    });
    
    // Try to schedule an event on each available day
    for (const date of availableDates) {
        // Convert workflow time bounds to Date objects for this specific date in the given timezone
        const startHour = w.timeStart.Hours;
        const startMinute = w.timeStart.Minutes;
        const endHour = w.timeEnd.Hours;
        const endMinute = w.timeEnd.Minutes;
        
        // Get year, month, day in the specified timezone
        const dateParts = date.toLocaleDateString('en-US', { 
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('/');
        
        // Create ISO strings for the start and end times in the correct timezone
        const startISODate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
        const endISODate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
        
        // Convert to specific timezone
        const dayStart = new Date(new Date(startISODate).toLocaleString('en-US', { timeZone }));
        const dayEnd = new Date(new Date(endISODate).toLocaleString('en-US', { timeZone }));
        
        // Check if we can fit the event between workflow bounds
        const eventStartTime =await  findAvailableTime(
            apiKey,
            events,
            dayStart,
            dayEnd,
            duration,
            coordinates,
            timeZone,
            transportation
        );
        
        if (eventStartTime!==null) {
            // Create an event
            const eventEndTime = new Date(eventStartTime);
            eventEndTime.setMinutes(eventEndTime.getMinutes() + duration);
            
            // Convert to ISO 8601 strings with the timezone offset
            const startISO = new Date(eventStartTime.toLocaleString('en-US', { timeZone })).toISOString();
            const endISO = new Date(eventEndTime.toLocaleString('en-US', { timeZone })).toISOString();
            
            return {
                name: name,
                description:description,
                startTime: startISO,
                endTime: endISO,
                coordinates:{
                    longitude:coordinates.longitude,
                    latitude: coordinates.latitude
                },
                transportationMode: "driving", // Default transportation mode
                workflow: w.id
            } as Event
        }
    }
    
    // Couldn't schedule the event
    return null;
};

// Helper function to find an available time slot for the event
const findAvailableTime=async(
    apiKey:string,
    events: Event[],
    dayStart: Date,
    dayEnd: Date, 
    duration: number,
    coordinates: Coordinates,
    timeZone: string,
    transportationMode: string

): Promise<Date | null>=> {
    // Create an array of busy periods
    const busyPeriods: {start: Date, end: Date}[] = [];
    
    // Add all existing events as busy periods
    for (const event of events) {
        // Parse event times and ensure they're in the correct timezone
        const eventStart = new Date(new Date(event.startTime).toLocaleString('en-US', { timeZone }));
        const eventEnd = new Date(new Date(event.endTime).toLocaleString('en-US', { timeZone }));
        
        // Estimate travel time from event location to our target location
        const travelTimeAfter = await computeTravelTime(
            apiKey,
            {latitude: event.coordinates.latitude, longitude: event.coordinates.longitude},
            coordinates,
            transportationMode, null, String(eventStart.getTime())
        );
        
        // Estimate travel time from our location to event location
        const travelTimeBefore = await computeTravelTime(
            apiKey,
            coordinates,
            {latitude: event.coordinates.latitude, longitude: event.coordinates.longitude},
            transportationMode, String(eventEnd.getTime()), null
        );
        
        // Add buffer for travel time
        const bufferStart = new Date(eventStart);
        bufferStart.setMinutes(bufferStart.getMinutes() - travelTimeBefore);
        
        const bufferEnd = new Date(eventEnd);
        bufferEnd.setMinutes(bufferEnd.getMinutes() + travelTimeAfter);
        
        busyPeriods.push({
            start: bufferStart,
            end: bufferEnd
        });
    }
    
    // Sort busy periods by start time
    busyPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Try to find a free slot
    let currentTime = dayStart;
    
    // Check if we can schedule before the first busy period
    for (const period of busyPeriods) {
        const availableMinutes = (period.start.getTime() - currentTime.getTime()) / 60000;
        
        if (availableMinutes >= duration) {
            return currentTime;
        }
        
        // Move current time to after this busy period
        currentTime = new Date(Math.max(currentTime.getTime(), period.end.getTime()));
    }
    
    // Check if we can schedule after the last busy period
    const availableMinutesAtEnd = (dayEnd.getTime() - currentTime.getTime()) / 60000;
    
    if (availableMinutesAtEnd >= duration) {
        return currentTime;
    }
    
    // Couldn't find an available slot
    return null;
}





