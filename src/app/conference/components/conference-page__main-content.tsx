// src/app/conference/components/conference-page__main-content.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
  Users,
} from 'lucide-react';
import type { Participant } from './conference-page__types';

interface ConferencePageMainContentProps {
  activeConferenceTitle: string;
  participants: Participant[];
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  showParticipantsPanel: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleParticipantList: () => void;
  onLeaveCall: () => void;
}

function MainVideoDisplay({ isScreenSharing, participants }: { isScreenSharing: boolean, participants: Participant[] }) {
  const activeParticipant = participants.find(p => !p.isVideoOff && p.id !== '1') || participants[0];

  return (
    <div className="conference-page__main-video-display relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center text-muted-foreground">
      {isScreenSharing ? (
        <div className="conference-page__screen-share-notice w-full h-full flex flex-col items-center justify-center bg-primary/10">
          <ScreenShare className="w-16 h-16 text-primary mb-4" />
          <p className="text-lg font-semibold">Вы демонстрируете свой экран</p>
          <p className="text-sm">Другие участники видят содержимое вашего экрана.</p>
        </div>
      ) : activeParticipant && !activeParticipant.isVideoOff ? (
        <>
          <Image
            src={`https://picsum.photos/800/450?random=${activeParticipant.id}`}
            alt={`Видеопоток ${activeParticipant.name}`}
            fill
            style={{ objectFit: "cover" }}
            data-ai-hint="человек видеозвонок"
            className="transition-opacity duration-300"
          />
          <div className="conference-page__participant-name-overlay absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {activeParticipant.name}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <VideoOff className="w-16 h-16 mb-2" />
          <span>{activeParticipant?.name ?? 'Видео выключено'}</span>
        </div>
      )}
    </div>
  );
}

export function ConferencePageMainContent({
  activeConferenceTitle,
  participants,
  isMuted,
  isVideoOff,
  isScreenSharing,
  showParticipantsPanel,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleParticipantList,
  onLeaveCall,
}: ConferencePageMainContentProps) {
  return (
    <div className="conference-page__main-area flex-grow flex flex-col">
      <Card className="conference-page__video-card flex-grow flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="conference-page__video-card-header pb-2">
          <CardTitle className="conference-page__video-card-title text-primary">{activeConferenceTitle}</CardTitle>
        </CardHeader>
        <CardContent className="conference-page__video-card-content flex-grow p-2 relative">
          <MainVideoDisplay isScreenSharing={isScreenSharing} participants={participants} />
        </CardContent>
        <CardFooter className="conference-page__controls-footer bg-secondary/30 p-2 flex justify-center gap-2 border-t">
          <Button variant={isMuted ? 'destructive' : 'outline'} size="icon" onClick={onToggleMute} aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}>
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button variant={isVideoOff ? 'destructive' : 'outline'} size="icon" onClick={onToggleVideo} aria-label={isVideoOff ? 'Включить видео' : 'Выключить видео'}>
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
          <Button variant={isScreenSharing ? 'default' : 'outline'} size="icon" onClick={onToggleScreenShare} aria-label={isScreenSharing ? 'Остановить демонстрацию' : 'Демонстрация экрана'}>
            {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
          </Button>
          <Button variant="outline" size="icon" onClick={onToggleParticipantList} aria-label={showParticipantsPanel ? 'Скрыть участников' : 'Показать участников'}>
            <Users />
          </Button>
          <Button variant="destructive" size="icon" onClick={onLeaveCall} aria-label="Покинуть звонок">
            <PhoneOff />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
