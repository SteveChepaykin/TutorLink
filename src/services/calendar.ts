// src/services/calendar.ts

/**
 * Represents a calendar event.
 */
export interface CalendarEvent {
  /** Unique ID for the event */
  id?: string; // Optional: Add an ID if needed for future operations like deleting/updating
  /**
   * The title of the event.
   */
  title: string;
  /**
   * The start date and time of the event.
   */
  start: Date;
  /**
   * The end date and time of the event.
   */
  end: Date;
  /**
   * A description of the event.
   */
  description?: string;
}

// --- In-Memory Cache ---
// Simulate a database or API endpoint with an in-memory array
const eventCache: CalendarEvent[] = [
  // {
  //   id: 'initial-event',
  //   title: 'Пример конференции',
  //   start: new Date(), // Today's date/time for the example
  //   end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
  //   description: 'Пример события видеоконференции.',
  // },
];

// Helper to generate a simple unique ID (replace with a robust solution in production)
let eventIdCounter = 0;
const generateId = () => `event-${Date.now()}-${eventIdCounter++}`;
// --- End In-Memory Cache ---

/**
 * Asynchronously retrieves calendar events for a given time range from the cache.
 *
 * @param startDate The start date of the time range.
 * @param endDate The end date of the time range.
 * @returns A promise that resolves to an array of CalendarEvent objects within the specified range.
 */
export async function getCalendarEvents(
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay for fetching

  // Filter events from the cache based on the date range
  // An event is included if it starts within the range OR ends within the range
  // OR starts before the range and ends after the range (spans the range)
  // OR starts and ends on the same day within the range (for single-day views)
  const filteredEvents = eventCache.filter((event) => {
    const eventStart = event.start.getTime();
    const eventEnd = event.end.getTime();
    const rangeStart = startDate.getTime();
    const rangeEnd = endDate.getTime();

    // Basic overlap check:
    return eventStart < rangeEnd && eventEnd > rangeStart;
  });

  console.log(`Fetched ${filteredEvents.length} events for range: ${startDate.toISOString()} - ${endDate.toISOString()}`);
  return filteredEvents;
}

/**
 * Asynchronously creates a calendar event and adds it to the cache.
 *
 * @param event The calendar event to create (without an ID initially).
 * @returns A promise that resolves to the created CalendarEvent object with an ID.
 */
export async function createCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  // Simulate API delay for creation
  await new Promise((resolve) => setTimeout(resolve, 200));

  const newEvent: CalendarEvent = {
    ...event,
    id: generateId(), // Assign a unique ID
  };

  // Add the new event to the cache
  eventCache.push(newEvent);

  console.log('Event created and added to cache:', newEvent);
  console.log('Current cache size:', eventCache.length);

  return newEvent; // Return the event with the assigned ID
}

// --- Optional: Add functions to update/delete events if needed later ---
/**
 * Asynchronously deletes a calendar event from the cache.
 * @param eventId The ID of the event to delete.
 * @returns A promise that resolves when the event is deleted.
 */
/*
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
  const index = eventCache.findIndex(event => event.id === eventId);
  if (index > -1) {
    eventCache.splice(index, 1);
    console.log(`Event ${eventId} deleted from cache.`);
  } else {
    console.warn(`Event ${eventId} not found in cache for deletion.`);
  }
}
*/

/**
 * Asynchronously updates a calendar event in the cache.
 * @param updatedEvent The event data to update (must include ID).
 * @returns A promise that resolves to the updated event or null if not found.
 */
/*
export async function updateCalendarEvent(updatedEvent: CalendarEvent): Promise<CalendarEvent | null> {
   await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate delay
   const index = eventCache.findIndex(event => event.id === updatedEvent.id);
   if (index > -1) {
     eventCache[index] = { ...eventCache[index], ...updatedEvent };
     console.log(`Event ${updatedEvent.id} updated in cache.`);
     return eventCache[index];
   } else {
     console.warn(`Event ${updatedEvent.id} not found in cache for update.`);
     return null;
   }
}
*/

