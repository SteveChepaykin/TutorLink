// src/app/calendar/page.tsx
'use client';

import type { CalendarEvent } from '@/services/calendar';
import { createCalendarEvent, getCalendarEvents } from '@/services/calendar';
import type { User } from '@/services/user';
import { getCurrentUser } from '@/services/user';
import * as React from 'react';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

import { CalendarPageCalendarCard } from './components/calendar-page__calendar-card';
import { CalendarPageEventsCard } from './components/calendar-page__events-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState<Date>(startOfMonth(new Date()));
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = React.useState(true);
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = React.useState(false);

  const { toast } = useToast();

  React.useEffect(() => {
    async function loadUser() {
      setIsLoadingUser(true);
      try {
        const currentUserData = await getCurrentUser();
        setUser(currentUserData);
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось проверить права пользователя.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUser(false);
      }
    }
    loadUser();
  }, [toast]);

  const fetchEvents = React.useCallback(async (month: Date) => {
    setIsLoadingEvents(true);
    try {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const fetchedEvents = await getCalendarEvents(start, end);
      const eventsWithDates = fetchedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(eventsWithDates);
    } catch (error) {
      console.error('Ошибка при загрузке событий календаря:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить события календаря.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEvents(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchEvents(currentMonth);
  }, [currentMonth, fetchEvents]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(startOfMonth(month));
  };

  const handleScheduleSubmit = async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (user?.role !== 'teacher') {
      toast({
        title: 'Действие запрещено',
        description: 'Только репетиторы могут планировать конференции.',
        variant: 'destructive',
      });
      setIsScheduleDialogOpen(false);
      return;
    }

    setIsScheduling(true);
    try {
      await createCalendarEvent(eventData);
      toast({
        title: 'Успех',
        description: 'Конференция успешно запланирована.',
      });
      setIsScheduleDialogOpen(false);
      setSelectedDate(eventData.start);
      fetchEvents(currentMonth); // Refresh events for the current month
    } catch (error) {
      console.error('Ошибка при планировании конференции:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось запланировать конференцию.',
        variant: 'destructive',
      });
    } finally {
      setIsScheduling(false);
    }
  };
  
  const canSchedule = user?.role === 'teacher';

  if (isLoadingUser && isLoadingEvents) {
    return (
      <div className="calendar-page flex flex-col lg:flex-row gap-6">
        <Skeleton className="lg:w-1/2 h-96" />
        <Skeleton className="lg:w-1/2 h-96" />
      </div>
    );
  }


  return (
    <div className="calendar-page flex flex-col lg:flex-row gap-6">
      <CalendarPageCalendarCard
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        events={events}
        isLoadingUser={isLoadingUser}
        isLoadingEvents={isLoadingEvents}
        canSchedule={canSchedule}
        isScheduleDialogOpen={isScheduleDialogOpen}
        isScheduling={isScheduling}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
        onScheduleSubmit={handleScheduleSubmit}
        onScheduleDialogChange={setIsScheduleDialogOpen}
      />
      <CalendarPageEventsCard
        selectedDate={selectedDate}
        events={events}
        isLoadingEvents={isLoadingEvents}
      />
    </div>
  );
}
