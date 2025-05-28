// src/app/calendar/components/calendar-page__events-card.tsx
'use client';

import type { CalendarEvent } from '@/services/calendar';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format, startOfDay, endOfDay } from 'date-fns'; 
import { ru } from 'date-fns/locale';

interface CalendarPageEventsCardProps {
  selectedDate: Date | undefined;
  events: CalendarEvent[];
  isLoadingEvents: boolean;
}

export function CalendarPageEventsCard({
  selectedDate,
  events,
  isLoadingEvents,
}: CalendarPageEventsCardProps) {
  
  const eventsForSelectedDate = React.useMemo(() => {
     if (!selectedDate) return [];
     const dayStart = startOfDay(selectedDate);
     const dayEnd = endOfDay(selectedDate);
     return events.filter(event => {
         const eventStart = event.start.getTime();
         const eventEnd = event.end.getTime();
         return eventStart < dayEnd.getTime() && eventEnd > dayStart.getTime();
     }).sort((a, b) => a.start.getTime() - b.start.getTime()); 
 }, [selectedDate, events]);

  return (
    <Card className="calendar-page__events-card lg:w-1/2 shadow-lg">
      <CardHeader className="calendar-page__events-card-header">
        <CardTitle className="calendar-page__events-card-title text-primary">
          {selectedDate ? `События на ${format(selectedDate, 'PPP', { locale: ru })}` : 'Выберите дату'}
        </CardTitle>
        <CardDescription className="calendar-page__events-card-description">
          {selectedDate
            ? 'Конференции, запланированные на выбранный день.'
            : 'Нажмите на дату в календаре, чтобы увидеть события.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="calendar-page__events-card-content">
        {isLoadingEvents ? (
           <div className="space-y-2">
               <Skeleton className="h-10 w-full rounded" />
               <Skeleton className="h-10 w-5/6 rounded" />
               <Skeleton className="h-10 w-full rounded" />
           </div>
        ) : selectedDate ? (
          eventsForSelectedDate.length > 0 ? (
            <Table className="calendar-page__events-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead className="hidden sm:table-cell">Описание</TableHead>
                  <TableHead>Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventsForSelectedDate.map((event) => ( 
                  <TableRow key={event.id ?? event.start.toISOString()} className="calendar-page__event-item">
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {format(event.start, 'p', { locale: ru })} - {format(event.end, 'p', { locale: ru })}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs max-w-[150px] truncate">{event.description || '-'}</TableCell>
                     <TableCell>
                       <Button variant="outline" size="sm" asChild>
                          <a href="/conference">Присоединиться</a>
                       </Button>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">На эту дату конференций не запланировано.</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Пожалуйста, выберите дату в календаре.</p>
        )}
      </CardContent>
    </Card>
  );
}
