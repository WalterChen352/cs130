/**
 * Represents the scheduling style with an identifier and a name.
 */
export class SchedulingStyle {

  /** The unique id of the scheduling style. */
  Id: number;

  /** Name of the scheduling style. */
  Name: string;

  /**
   * Creates an instance of the SchedulingStyle class.
   * @param id - The unique id for the scheduling style.
   * @param name - The name of the scheduling style.
   */
  constructor(id: number, name: string) {
    this.Id = id;
    this.Name = name;
  }
}

export default SchedulingStyle;