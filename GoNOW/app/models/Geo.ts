import Coordinates from "./Location";

//  Format is based on geo object types from response of Google API.
//  https://developers.google.com/maps/documentation/directions/get-directions

/**
 * Represents distance in a human-readable format and its value in meters (SI).
 * 
 * @export
 * @interface Distance
 * @typedef {Distance}
 */
export interface Distance {
  /**
   * Human-readable description of the distance (e.g., "1.2 km").
   *
   * @type {string}
   */
  text: string;

  /**
   * Numerical value of the distance in meters (SI).
   *
   * @type {number}
   */
  value: number;
}

/**
 * Represents the duration of a trip or a step in a human-readable format
 * and its value in seconds.
 *
 * @export
 * @interface Duration
 * @typedef {Duration}
 */
export interface Duration {
  /**
   * Human-readable description of the duration (e.g., "15 mins").
   *
   * @type {string}
   */
  text: string;

  /**
   * Numerical value of the duration in seconds.
   *
   * @type {number}
   */
  value: number;
}

/**
 * Represents a location coordinates (latitude and longitude)
 * with short naming lat,lng.
 *
 * @export
 * @interface Loc
 * @typedef {Loc}
 */
export interface Loc {
  /**
   * Coordinates.
   *
   * @type {Coordinates}
   */
  latLng: Coordinates;
}

export interface navigationInstruction {
  /**
   * Maneuver type.
   *
   * @type {string}
   */
  maneuver: string;

  /**
   * Instructions text.
   *
   * @type {string}
   */
  instructions: string;
}

/**
 * Represents a single step in the directions.
 *
 * @export
 * @interface Step
 * @typedef {Step}
 */
export interface Step {
  /**
   * Distance covered in this step.
   *
   * @type {number}
   */
  distanceMeters: number;

  /**
   * Duration required to complete this step.
   *
   * @type {string}
   */
  staticDuration: string;

  /**
   * Navifation Instructions
   *
   * @type {navigationInstruction}
   */
  navigationInstruction: navigationInstruction;

  /**
   * Step start location.
   *
   * @type {Loc}
   */
  startLocation: Loc;

  /**
   * Step end location.
   *
   * @type {Loc}
   */
  endLocation: Loc;

  /**
   * Traveling mode, should correspond to TransportationMode.apiName
   *
   * @type {?string}
   */
  travelMode?: string;

  /**
   * Polyline for drawing the route on the map.
   *
   * @type {{points: string}}
   */
  polyline: {
    
    /**
     * Encoded polyline string for the route segment.
     *
     * @type {string}
     */
    encodedPolyline: string;
  };
}

/**
 * Represents a segment of a route (a "leg").
 *
 * @export
 * @interface Leg
 * @typedef {Leg}
 */
export interface Leg {
  /**
   * Total distance for this leg.
   *
   * @type {number}
   */
  distanceMeters: number;
  
  /**
   * Total duration in sec for this leg.
   *
   * @type {string}
   */
  duration: string;
  
  /**
   * Location of the starting point for this leg.
   *
   * @type {Loc}
   */
  startLocation: Loc;
  
  /**
   * Location of the endpoint for this leg.
   *
   * @type {Loc}
   */
  endLocation: Loc;
  
  /**
   * List of steps for this leg.
   *
   * @type {Step[]}
   */
  steps: Step[];
}

/**
 * Represents a complete route with one or more legs.
 *
 * @export
 * @interface Route
 * @typedef {Route}
 */
export interface Route {

  /**
   * List of legs, each leg represents a segment of the route.
   *
   * @type {Leg[]}
   */
  legs: Leg[];

  /**
   * Status of the response (e.g., "OK").
   *
   * @type {string}
   */
  //status: string;
}

export default Route;