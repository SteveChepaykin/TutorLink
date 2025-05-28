// src/app/calendar/components/calendar-page__calendar-card.tsx
'use client';

import type { CalendarEvent } from '@/services/calendar';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfDay, 
  endOfDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns'; 
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';


interface CalendarPageCalendarCardProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  events: CalendarEvent[];
  isLoadingUser: boolean;
  isLoadingEvents: boolean;
  canSchedule: boolean;
  isScheduleDialogOpen: boolean;
  isScheduling: boolean;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
  onScheduleSubmit: (eventData: Omit<CalendarEvent, 'id'>) => Promise<void>;
  onScheduleDialogChange: (open: boolean) => void;
}

export function CalendarPageCalendarCard({
  currentMonth,
  selectedDate,
  events,
  isLoadingUser,
  isLoadingEvents,
  canSchedule,
  isScheduleDialogOpen,
  isScheduling,
  onDateSelect,
  onMonthChange,
  onScheduleSubmit,
  onScheduleDialogChange,
}: CalendarPageCalendarCardProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const internalHandleScheduleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dateStr = formData.get('date') as string; 
    const startTime = formData.get('start-time') as string; 
    const endTime = formData.get('end-time') as string; 

    if (!title || !dateStr || !startTime || !endTime) {
      toast({
        title: 'Отсутствует информация',
        description: 'Пожалуйста, заполните все обязательные поля.',
        variant: 'destructive',
      });
      return;
    }

    const startDateTime = new Date(`${dateStr}T${startTime}:00`);
    const endDateTime = new Date(`${dateStr}T${endTime}:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      toast({
        title: 'Неверная дата/время',
        description: 'Пожалуйста, проверьте формат даты и времени.',
        variant: 'destructive',
      });
      return;
    }

    if (endDateTime <= startDateTime) {
      toast({
        title: 'Неверный диапазон времени',
        description: 'Время окончания должно быть позже времени начала.',
        variant: 'destructive',
      });
      return;
    }
    
    const eventToCreate: Omit<CalendarEvent, 'id'> = {
      title,
      start: startDateTime,
      end: endDateTime,
      description,
    };
    await onScheduleSubmit(eventToCreate);
    formRef.current?.reset();
  };

  const dayHasEvent = React.useCallback((day: Date): boolean => {
    const dayStart = startOfDay(day).getTime();
    const dayEnd = endOfDay(day).getTime();
    return events.some(event => {
        const eventStart = event.start.getTime();
        const eventEnd = event.end.getTime();
        return eventStart < dayEnd && eventEnd > dayStart;
    });
  }, [events]);
  
  const firstDayOfGrid = startOfWeek(startOfMonth(currentMonth), { locale: ru });
  const lastDayOfGrid = endOfWeek(endOfMonth(currentMonth), { locale: ru });
  const daysToRender = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <Card className="calendar-page__calendar-card lg:w-1/2 shadow-lg">
      <CardHeader className="calendar-page__calendar-card-header">
        <CardTitle className="calendar-page__calendar-card-title text-primary flex items-center justify-between">
          Календарь конференций
          {isLoadingUser ? (
              <Skeleton className="h-8 w-36" />
          ) : canSchedule ? (
            <Dialog open={isScheduleDialogOpen} onOpenChange={onScheduleDialogChange}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!selectedDate}>
                   <PlusCircle className="mr-2 h-4 w-4" />
                   Запланировать ({selectedDate ? format(selectedDate, 'd MMM', {locale: ru}) : 'Выберите дату'})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Запланировать новую конференцию</DialogTitle>
                  <DialogDescription>
                     Заполните данные для новой сессии {selectedDate ? `на ${format(selectedDate, 'PPP', {locale: ru})}` : ''}.
                  </DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={internalHandleScheduleSubmit} className="calendar-page__schedule-form grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Название
                    </Label>
                    <Input id="title" name="title" className="col-span-3" required disabled={isScheduling}/>
                  </div>
                   <input type="hidden" id="date" name="date" value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} />
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="start-time" className="text-right">Время начала</Label>
                     <Input id="start-time" name="start-time" type="time" className="col-span-3" required disabled={isScheduling} step="900"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-time" className="text-right">Время окончания</Label>
                    <Input id="end-time" name="end-time" type="time" className="col-span-3" required disabled={isScheduling} step="900"/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Описание
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="col-span-3"
                      placeholder="Необязательно: добавьте краткое описание..."
                      disabled={isScheduling}
                    />
                  </div>
                  <DialogFooter>
                   <DialogTrigger asChild>
                       <Button type="button" variant="outline" disabled={isScheduling}>Отмена</Button>
                   </DialogTrigger>
                    <Button type="submit" disabled={isScheduling || !selectedDate}>
                      {isScheduling ? 'Планирование...' : 'Запланировать конференцию'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : null}
        </CardTitle>
        <CardDescription className="calendar-page__calendar-card-description">
           {isLoadingUser ? <Skeleton className="h-4 w-3/4"/> : canSchedule
             ? 'Выберите дату для просмотра или добавления конференции.'
             : 'Выберите дату для просмотра запланированных конференций.'}
         </CardDescription>
      </CardHeader>
      <CardContent className="calendar-page__calendar-card-content flex justify-center p-2 sm:p-4">
          <div className="calendar-page__calendar-widget w-full max-w-md">
            <div className="calendar-page__calendar-navigation flex items-center justify-between mb-3">
              <Button variant="outline" size="icon" onClick={() => onMonthChange(subMonths(currentMonth, 1))} aria-label="Предыдущий месяц">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="calendar-page__current-month text-lg font-semibold text-center text-primary capitalize">
                {format(currentMonth, 'LLLL yyyy', { locale: ru })}
              </h2>
              <Button variant="outline" size="icon" onClick={() => onMonthChange(addMonths(currentMonth, 1))} aria-label="Следующий месяц">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="calendar-page__day-names grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground mb-2">
              {dayNames.map(dayName => <div key={dayName}>{dayName}</div>)}
            </div>
            <div className="calendar-page__days-grid grid grid-cols-7 gap-1">
              {daysToRender.map((day) => {
                const isDayInCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const hasEvent = isDayInCurrentMonth && dayHasEvent(day);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => isDayInCurrentMonth && onDateSelect(day)}
                    className={cn(
                      "calendar-page__day-cell p-1 sm:p-2 h-10 w-full flex items-center justify-center rounded-md relative text-xs sm:text-sm transition-colors",
                      isDayInCurrentMonth ? "text-card-foreground hover:bg-accent hover:text-accent-foreground" : "text-muted-foreground opacity-50 cursor-default",
                      !isDayInCurrentMonth && "pointer-events-none",
                      isSelected && isDayInCurrentMonth && "bg-primary text-primary-foreground hover:bg-primary/90",
                      isTodayDate && isDayInCurrentMonth && !isSelected && "bg-accent/50 border border-primary/50",
                      isLoadingEvents && "animate-pulse bg-muted/50"
                    )}
                    disabled={!isDayInCurrentMonth || isLoadingEvents}
                    aria-label={format(day, 'PPP', { locale: ru })}
                  >
                    {format(day, 'd')}
                    {hasEvent && (
                      <span className="calendar-page__event-indicator absolute bottom-1 right-1 block h-1.5 w-1.5 rounded-full bg-destructive pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
      </CardContent>
    </Card>
  );
}

