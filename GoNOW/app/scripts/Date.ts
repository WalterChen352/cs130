/**
   * Formats a date object into a string with date and time.
   * 
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
export const formatDate = (date: Date): string => {
    const datePart = date.toLocaleDateString('en-CA');
    const timePart = date.toLocaleTimeString('en-GB');
    return `${datePart} ${timePart}`;
};