/**
 * Represents the scheduling style with an identifier and a name.
 */
export interface SchedulingStyle {

  /** The unique id of the scheduling style. */
  id: number;

  /** Name of the scheduling style. */
  name: string;

  /**
   * Creates an instance of the SchedulingStyle class.
   * @param id - The unique id for the scheduling style.
   * @param name - The name of the scheduling style.
   */
  }

const APP_SCHEDLING_STYLES:SchedulingStyle[]=[
  {id: 0, name: 'As soon as possible'}, {id:1, name: 'Limit one per day'}
] 

export const SS_ASAP=APP_SCHEDLING_STYLES[0];
export const SS_MAX_ONE=APP_SCHEDLING_STYLES[1];

export default APP_SCHEDLING_STYLES;