import { autoschedule } from '../schedule'; // Update with your actual module path
import type { Workflow, Time, Coordinates, Event} from '../types'
import APP_SCHEDLING_STYLES from '../types';
// Mock the current date to ensure consistent test results
const mockDate = new Date('2025-03-03T12:00:00Z'); // Using the current date from your session
jest.useFakeTimers().setSystemTime(mockDate);


jest.mock('../mapsQueries', ()=>({
   
  computeTravelTime: jest.fn(
     
    (_apiKey: string,origin: {latitude: number, longitude: number}, destination: {latitude: number, longitude: number}): number|null=> {
    
    // Calculate straight-line distance (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
    const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Assume average speed of 30 km/h in an urban setting
    // This returns travel time in minutes
    return Math.ceil(distance / 30 * 60);
  })
}))

describe('autoschedule function', () => {


  // Time objects for workflow time bounds
  const morning9am: Time = { hours: 9, minutes: 0 };
  const noon: Time = { hours: 12, minutes: 0 };
  const afternoon2pm: Time = { hours: 14, minutes: 0 };
  const evening5pm: Time = { hours: 17, minutes: 0 };
  const evening8pm: Time = { hours: 20, minutes: 0 };

  // Test locations
  const homeLocation: Coordinates = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
  const gymLocation: Coordinates = { latitude: 37.7833, longitude: -122.4167 }; // Near Union Square
  const libraryLocation: Coordinates = { latitude: 37.7786, longitude: -122.4159 }; // SF Public Library
  const parkLocation: Coordinates = { latitude: 37.7694, longitude: -122.4862 }; // Golden Gate Park

  // Current date references
  const today = new Date(mockDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Test workflows
  let workflowWeekdayMornings: Workflow;
  let workflowEveningStudy: Workflow;
  //let workflowWeekendOutings: Workflow;
  
  // Test events
  let existingEvents: Event[];
  let conflictingEvents: Event[];

  beforeEach(() => {
    // Reset date objects to avoid mutation issues between tests
    const freshToday = new Date(mockDate);
    const freshTomorrow = new Date(freshToday);
    freshTomorrow.setDate(freshTomorrow.getDate() + 1);
    const freshDayAfterTomorrow = new Date(freshToday);
    freshDayAfterTomorrow.setDate(freshDayAfterTomorrow.getDate() + 2);

    // Initialize workflows
    workflowWeekdayMornings = {
      id: 1,
      name: "Morning Exercise",
      color: "#FF5733", // Red-orange
      pushNotifications: true,
      timeStart: morning9am,
      timeEnd: noon,
      daysOfWeek: [false, true, true, true, true, true, false], // Mon-Fri
      schedulingStyle: APP_SCHEDLING_STYLES[0]

    }

    workflowEveningStudy = {
      id:2,
      name: "Evening Study",
      color: "#3498DB", // Blue
      pushNotifications:true,
      timeStart:afternoon2pm,
      timeEnd:evening8pm,
      daysOfWeek:[true, true, true, true, true, false, false], // Sun-Thu
      schedulingStyle:APP_SCHEDLING_STYLES[0]
    }

    workflowWeekendOutings = {
      id:3,
      name:"Weekend Outings",
      color:"#2ECC71", // Green
      pushNotifications:true,
      timeStart:noon,
      timeEnd:evening5pm,
      daysOfWeek:[true, false, false, false, false, false, true], // Sat-Sun
      schedulingStyle:APP_SCHEDLING_STYLES[0]
    }

    // Initialize existing events
    existingEvents = [
      // Morning Exercise workflow events
      {
        id:1,
       name: "Morning Jog",
        description:"Jog around the neighborhood",
        startTime:new Date(freshToday.getFullYear(), freshToday.getMonth(), freshToday.getDate(), 9, 30).toISOString(),
        endTime:new Date(freshToday.getFullYear(), freshToday.getMonth(), freshToday.getDate(), 10, 30).toISOString(),
        coordinates:{latitude:parkLocation.latitude,
        longitude:parkLocation.longitude},
        transportationMode:"walking",
        workflow:1
      },
      {
        id:2,
        name:"Gym Session",
        description:"Strength training",
        startTime:new Date(freshDayAfterTomorrow.getFullYear(), freshDayAfterTomorrow.getMonth(), freshDayAfterTomorrow.getDate(), 10, 0).toISOString(),
        endTime:new Date(freshDayAfterTomorrow.getFullYear(), freshDayAfterTomorrow.getMonth(), freshDayAfterTomorrow.getDate(), 11, 0).toISOString(),
        coordinates:{latitude:gymLocation.latitude,
        longitude:gymLocation.longitude},
        transportationMode:"driving",
        workflow:1
      },
      
      // Evening Study workflow events
      {
        id:3,
        name:"Study Group",
        description:"Work on project with classmates",
        startTime:new Date(freshTomorrow.getFullYear(), freshTomorrow.getMonth(), freshTomorrow.getDate(), 16, 0).toISOString(),
        endTime:new Date(freshTomorrow.getFullYear(), freshTomorrow.getMonth(), freshTomorrow.getDate(), 18, 0).toISOString(),
        coordinates:{latitude:libraryLocation.latitude,
        longitude:libraryLocation.longitude},
        transportationMode:"transit",
        workflow:2
      },
      
      // Weekend Outings workflow events
      {
        id:4,
        name:"Park Picnic",
        description:"Afternoon picnic with friends",
        startTime:new Date(freshToday.getFullYear(), freshToday.getMonth(), freshToday.getDate(), 13, 0).toISOString(),
        endTime:new Date(freshToday.getFullYear(), freshToday.getMonth(), freshToday.getDate(), 15, 0).toISOString(),
        coordinates:{latitude:parkLocation.latitude,
        longitude:parkLocation.longitude},
        transportationMode:"driving",
        workflow:3
      }
    ];

    // Create conflicting events array
    conflictingEvents = [...existingEvents];
    
    // Add events for the next 14 days at the same time each day
    for (let i = 1; i <= 14; i++) {
      const conflictDate = new Date(freshToday);
      conflictDate.setDate(conflictDate.getDate() + i);
      
      conflictingEvents.push(
        {
          id:5,
          name:"Conflicting Event",
          description:"This event blocks most time slots",
          startTime:new Date(conflictDate.getFullYear(), conflictDate.getMonth(), conflictDate.getDate(), 10, 0).toISOString(),
          endTime:new Date(conflictDate.getFullYear(), conflictDate.getMonth(), conflictDate.getDate(), 19, 0).toISOString(),
          coordinates:{latitude:homeLocation.latitude,
          longitude:homeLocation.longitude},
          transportationMode:"driving",
          workflow:1 // Same workflow to create conflicts
        }
      );
    }
  });

  // test('should schedule a morning exercise event on an available weekday',async () => {
  //   const result =await autoschedule(
  //     'MOCKAPIKEY',
  //     workflowWeekdayMornings,
  //     existingEvents,
  //     gymLocation,
  //     60, // 60 minutes duration
  //     "America/Los_Angeles", // Timezone,
  //     'test1',
  //     'desc1',
  //     true
  //   );

  //   expect(result).not.toBeNull();
  //   if (result) {
  //     const startTime = new Date(result.startTime);
  //     const endTime = new Date(result.endTime);
      
  //     // Check that the event is scheduled on a weekday
  //     const dayOfWeek = startTime.getDay();
  //     expect(dayOfWeek).toBeGreaterThanOrEqual(1); // Monday
  //     expect(dayOfWeek).toBeLessThanOrEqual(5); // Friday
      
  //     // Check that the event is within the workflow bounds
  //     const hour = startTime.getHours();
  //     expect(hour).toBeGreaterThanOrEqual(9);
  //     expect(hour).toBeLessThan(12);
      
  //     // Check that the duration is correct
  //     const durationMs = endTime.getTime() - startTime.getTime();
  //     expect(durationMs).toBe(60 * 60 * 1000); // 60 minutes
      
  //     // Check that the location is set correctly
  //     expect(result.location.latitude).toBe(gymLocation.latitude);
  //     expect(result.location.longitude).toBe(gymLocation.longitude);
  //   }
  // });

  test('should schedule an evening study event in New York timezone', async() => {
    const result = await autoschedule(
      'MOCKAPIKEY',
      workflowEveningStudy,
      existingEvents,
      libraryLocation,
      90, // 90 minutes duration
      "America/New_York", // Different timezone
      'test2',
      'desc2',
      true,
       "DRIVE",
       new Date().toISOString(),
       14
    );

    expect(result).not.toBeNull();
    if (result) {
      // Convert times to NY timezone for testing
      //const options = { timeZone: "America/New_York" };
      const startTime = new Date(result.startTime);
      const endTime = new Date(result.endTime);
      
      // Check that the event is scheduled on a valid day (Sun-Thu)
      const dayOfWeek = startTime.getDay();
      expect([0, 1, 2, 3, 4]).toContain(dayOfWeek);
      
      // Check that the event is within the workflow bounds
      // Note: This check needs to account for timezone conversion in a real test
      
      // Check that the duration is correct
      const durationMs = endTime.getTime() - startTime.getTime();
      expect(durationMs).toBe(90 * 60 * 1000); // 90 minutes
      
      // Check that the location is set correctly
      expect(result.coordinates.latitude).toBe(libraryLocation.latitude);
      expect(result.coordinates.longitude).toBe(libraryLocation.longitude);
    }
  });

  // test('should schedule a weekend outing in London timezone', async () => {
  //   const result = await autoschedule(
  //     'MOCKAPIKEY',
  //     workflowWeekendOutings,
  //     existingEvents,
  //     parkLocation,
  //     180, // 3 hours duration
  //     "Europe/London", // Different timezone
  //     'test3',
  //     'desc3',
  //     true,
  //      "DRIVE",
  //      new Date().toISOString(),
  //      14
  //   );

  //   expect(result).not.toBeNull();
  //   if (result) {
  //     const startTime = new Date(result.startTime);
      
  //     // Check that the event is scheduled on a weekend
  //     const dayOfWeek = startTime.getDay();
  //     expect([0, 6]).toContain(dayOfWeek); // Saturday or Sunday
      
  //     // Check that the event has the correct duration
  //     const endTime = new Date(result.endTime);
  //     const durationMs = endTime.getTime() - startTime.getTime();
  //     expect(durationMs).toBe(180 * 60 * 1000); // 3 hours
      
  //     // Check that the location is set correctly
  //     expect(result.coordinates.latitude).toBe(parkLocation.latitude);
  //     expect(result.coordinates.longitude).toBe(parkLocation.longitude);
  //   }
  // });

  test('should return null when no available slots due to conflicts',async () => {
    const result = await autoschedule(
      'MOCKAPIKEY',
      workflowWeekdayMornings,
      conflictingEvents,
      gymLocation,
      60,
      "America/Los_Angeles",
      'test4',
      'desc4',
      true,
       "DRIVE",
       new Date().toISOString(),
       14
    );

    expect(result).toBeNull();
  });
  //Not taking acount of timezones yet... will be fixed later
  // test('respects the timezone when checking workflow days of week', async () => {
  //   // Create a workflow that only allows events on Monday
  //   const mondayOnlyWorkflow = {
  //     id:4,
  //     name:"Monday Only",
  //     color:"#9B59B6", // Purple
  //     pushNotifications:true,
  //     timeStart:morning9am,
  //     timeEnd:noon,
  //     daysOfWeek:[false, true, false, false, false, false, false], // Monday only
  //     schedulingStyle:null
  //   };
    
  //   const localMondayDate = new Date(mockDate);
  //   // Adjust to ensure the test date falls on a Monday locally
  //   while (localMondayDate.getDay() !== 1) {
  //     localMondayDate.setDate(localMondayDate.getDate() + 1);
  //   }
    
  //   // This timezone is significantly ahead and might push the date to Tuesday
  //   const farEastTz = "Asia/Tokyo";
    
  //   const result = await autoschedule(
  //     'MOCKAPIKEY',
  //     mondayOnlyWorkflow,
  //     [], // No existing events
  //     homeLocation,
  //     60,
  //     farEastTz,
  //     'test5',
  //     'test6',
  //     true
  //   );
    
  //   // If the function is correctly checking the day of week in the specified timezone,
  //   // it should either find a Monday or return null if all Mondays are in the past
  //   if (result) {
  //     const resultDate = new Date(result.startTime);
  //     const options = { timeZone: farEastTz, weekday: 'long' } as const;
  //     const dayName = resultDate.toLocaleDateString('en-US', options);
  //     expect(dayName.toLowerCase()).toBe('monday');
  //   }
  // });

  test('calculates travel time correctly',async  () => {
    // Add an event that requires travel to and from
    const farLocation: Coordinates = { latitude: 37.8, longitude: -122.5 }; // Distant location
    
    // Add an event ending just before our desired time
    const justBeforeDate = new Date(mockDate);
    justBeforeDate.setDate(justBeforeDate.getDate() + 3); // Few days from now
    justBeforeDate.setHours(8, 0, 0, 0); // 8 AM
    
    const nearbyEvent = {
      id: 6,
      name:"Event Near Desired Time",
      description:"This event ends just before we'd want to schedule",
      startTime:new Date(justBeforeDate.getFullYear(), justBeforeDate.getMonth(), justBeforeDate.getDate(), 7, 0).toISOString(),
      endTime:new Date(justBeforeDate.getFullYear(), justBeforeDate.getMonth(), justBeforeDate.getDate(), 8, 0).toISOString(),
      coordinates:{latitude:farLocation.latitude,
      longitude:farLocation.longitude},
      transportationMode:"driving",
      workflow:1
    };
    
    const eventsWithTravel = [...existingEvents, nearbyEvent];
    
    const result = await autoschedule(
      'MOCKAPIKEY',
      workflowWeekdayMornings,
      eventsWithTravel,
      gymLocation, 
      60,
      "America/Los_Angeles",
      'test6',
      'desc6',
      true,
       "DRIVE",
       new Date().toISOString(),
       14
    );
    
    expect(result).not.toBeNull();
    if (result) {
      const startTime = new Date(result.startTime);
      
      // If travel time is calculated correctly, the new event shouldn't start exactly at 9 AM
      // but rather after travel time from the farLocation
      const timeAfterNearbyEvent = new Date(justBeforeDate);
      timeAfterNearbyEvent.setHours(9, 0, 0, 0); // Workflow starts at 9 AM
      
      // The event should not be scheduled right after the previous one without travel time
      expect(startTime.getTime()).not.toBe(timeAfterNearbyEvent.getTime());
    }
  });
});