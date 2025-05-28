// src/app/conference/page.tsx
'use client';

import type { CalendarEvent } from '@/services/calendar';
import { getCalendarEvents } from '@/services/calendar';
import { startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { AlertCircle } from 'lucide-react';

import { ConferencePageMainContent } from './components/conference-page__main-content';
import { ConferencePageSidebar } from './components/conference-page__sidebar';
import type { Message, Participant } from './components/conference-page__types';


export default function ConferencePage() {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
  const [participants, setParticipants] = React.useState<Participant[]>([
      { id: '1', name: 'Вы', avatar: 'https://picsum.photos/50/50?random=1', isMuted: false, isVideoOff: false },
      { id: '2', name: 'Алиса', avatar: 'https://picsum.photos/50/50?random=2', isMuted: true, isVideoOff: false },
      { id: '3', name: 'Борис', avatar: 'https://picsum.photos/50/50?random=3', isMuted: false, isVideoOff: true },
      { id: '4', name: 'Сергей', avatar: 'https://picsum.photos/50/50?random=4', isMuted: false, isVideoOff: false },
      { id: '5', name: 'Елена', avatar: 'https://picsum.photos/50/50?random=5', isMuted: false, isVideoOff: false },
  ]);
  const [showParticipantsPanel, setShowParticipantsPanel] = React.useState(false); // Renamed for clarity
  const { toast } = useToast();

  const [isActiveConference, setIsActiveConference] = React.useState<boolean | null>(null);
  const [isLoadingConferenceCheck, setIsLoadingConferenceCheck] = React.useState(true);
  const [activeConferenceTitle, setActiveConferenceTitle] = React.useState<string>('Видеоконференция');

  React.useEffect(() => {
    async function checkActiveConference() {
      setIsLoadingConferenceCheck(true);
      try {
        const now = new Date();
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);
        
        const todaysEvents: CalendarEvent[] = (await getCalendarEvents(todayStart, todayEnd)).map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }));

        const currentConference = todaysEvents.find(
          event => event.start <= now && event.end >= now
        );

        if (currentConference) {
            setIsActiveConference(true);
            setActiveConferenceTitle(currentConference.title);
        } else {
            setIsActiveConference(false);
        }

      } catch (error) {
        console.error('Ошибка при проверке активных конференций:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось проверить наличие активных конференций.',
          variant: 'destructive',
        });
        setIsActiveConference(false); 
      } finally {
        setIsLoadingConferenceCheck(false);
      }
    }
    checkActiveConference();
  }, [toast]);

  React.useEffect(() => {
    if (!isActiveConference) return; 

    const timer = setTimeout(() => {
        if (Math.random() > 0.7) { 
             const randomParticipant = participants[Math.floor(Math.random() * (participants.length -1)) + 1]; 
             if (randomParticipant) {
                const newMessage: Message = {
                    sender: randomParticipant.name,
                    text: "Привет!",
                    timestamp: Date.now(),
                };
                setChatMessages(prev => [...prev, newMessage]);
             }
        }
    }, 5000 + Math.random() * 5000); 

    return () => clearTimeout(timer);
   }, [chatMessages, participants, isActiveConference]); 


  if (isLoadingConferenceCheck) {
    return (
      <div className="conference-page conference-page--loading flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <p className="text-muted-foreground text-lg">Проверка наличия активных конференций...</p>
      </div>
    );
  }

  if (!isActiveConference) {
    return (
      <div className="conference-page conference-page--no-active flex flex-col items-center justify-center h-[calc(100vh-10rem)] p-8 text-center">
        <Alert variant="default" className="max-w-md">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle className="text-xl font-semibold mt-2">Нет активных конференций</AlertTitle>
          <AlertDescription className="mt-2 text-base">
            В данный момент нет активных конференций. Пожалуйста, проверьте{' '}
            <Link href="/calendar" className="text-primary underline hover:text-primary/80">
              календарь
            </Link>{' '}
            для просмотра расписания.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="conference-page flex flex-col lg:flex-row gap-4 h-[calc(100vh-10rem)] max-h-[800px]">
      <ConferencePageMainContent
        activeConferenceTitle={activeConferenceTitle}
        participants={participants}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        showParticipantsPanel={showParticipantsPanel}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={() => setIsVideoOff(!isVideoOff)}
        onToggleScreenShare={() => {
          setIsScreenSharing(!isScreenSharing);
          toast({
            title: !isScreenSharing ? "Демонстрация экрана запущена" : "Демонстрация экрана остановлена",
            description: !isScreenSharing ? "Вы начали демонстрацию экрана." : "Вы больше не показываете свой экран.",
          });
        }}
        onToggleParticipantList={() => setShowParticipantsPanel(!showParticipantsPanel)}
        onLeaveCall={() => {
          toast({
            title: 'Звонок завершен',
            description: 'Вы покинули конференцию.',
          });
          // Add navigation or state change for leaving call if needed
        }}
      />
      <ConferencePageSidebar
        chatMessages={chatMessages}
        participants={participants}
        showParticipantsPanel={showParticipantsPanel}
        onSendMessage={(newMessages) => setChatMessages(newMessages)}
        onToggleParticipantList={() => setShowParticipantsPanel(!showParticipantsPanel)}
      />
    </div>
  );
}
