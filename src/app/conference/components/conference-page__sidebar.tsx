// src/app/conference/components/conference-page__sidebar.tsx
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import { MicOff, Video, VideoOff, Send, Users, MessageSquare } from 'lucide-react';
import type { Message, Participant } from './conference-page__types';

interface ConferencePageSidebarProps {
  chatMessages: Message[];
  participants: Participant[];
  showParticipantsPanel: boolean;
  onSendMessage: (newMessages: Message[]) => void;
  onToggleParticipantList: () => void;
}

export function ConferencePageSidebar({
  chatMessages,
  participants,
  showParticipantsPanel,
  onSendMessage,
  onToggleParticipantList,
}: ConferencePageSidebarProps) {
  const [chatInput, setChatInput] = React.useState('');
  const chatScrollAreaRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const newMessage: Message = {
        sender: 'Вы',
        text: chatInput,
        timestamp: Date.now(),
      };
      onSendMessage([...chatMessages, newMessage]);
      setChatInput('');
    }
  };

  React.useEffect(() => {
    if (chatScrollAreaRef.current) {
        const scrollElement = chatScrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
           scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }
  }, [chatMessages]);

  return (
    <Card className={cn(
      "conference-page__sidebar lg:w-80 flex flex-col shadow-lg transition-all duration-300 ease-in-out",
      showParticipantsPanel ? "block" : "hidden lg:flex"
    )}>
      <CardHeader className="conference-page__sidebar-header flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="conference-page__sidebar-title text-lg text-primary">
          {showParticipantsPanel ? 'Участники' : 'Чат'} ({showParticipantsPanel ? participants.length : chatMessages.length})
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onToggleParticipantList} className="lg:hidden">
          {showParticipantsPanel ? <MessageSquare /> : <Users />}
        </Button>
      </CardHeader>

      {showParticipantsPanel ? (
        <ScrollArea className="conference-page__participants-list-scroll-area flex-grow p-4">
          <div className="conference-page__participants-list flex gap-4 pb-4 overflow-x-auto">
            {participants.map(p => (
              <div key={p.id} className="conference-page__participant-item flex flex-col items-center gap-2 w-24 flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={p.avatar} alt={p.name} data-ai-hint="аватар пользователь"/>
                  <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  {p.isMuted && <MicOff className="absolute bottom-0 right-0 h-4 w-4 text-red-500 bg-background/80 rounded-full p-0.5" />}
                  {!p.isVideoOff && <Video className="absolute top-0 right-0 h-4 w-4 text-green-500 bg-background/80 rounded-full p-0.5" />}
                  {p.isVideoOff && <VideoOff className="absolute top-0 right-0 h-4 w-4 text-muted-foreground bg-background/80 rounded-full p-0.5" />}
                </Avatar>
                <span className="text-sm font-medium text-center truncate w-full">{p.name}</span>
              </div>
            ))}
          </div>
          {participants.length === 0 && <p className="text-sm text-muted-foreground text-center">Нет других участников.</p>}
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className="conference-page__chat-messages-scroll-area flex-grow p-4" ref={chatScrollAreaRef}>
            <div className="conference-page__chat-messages-list space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`conference-page__chat-message-item flex ${msg.sender === 'Вы' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'Вы' ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                    <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-muted-foreground text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {chatMessages.length === 0 && <p className="text-sm text-muted-foreground text-center">Сообщения чата будут отображаться здесь.</p>}
            </div>
          </ScrollArea>
          <CardFooter className="conference-page__chat-input-footer p-2 border-t">
            <form onSubmit={handleSendMessage} className="conference-page__chat-form flex w-full gap-2">
              <Input
                placeholder="Введите сообщение..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon" aria-label="Отправить сообщение">
                <Send />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
