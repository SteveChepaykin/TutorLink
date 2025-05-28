// src/app/teachers/components/teachers-page__header-card.tsx
'use client';

import type { User } from '@/services/user';
import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TeachersPageHeaderCardProps {
  currentUser: User | null;
}

export function TeachersPageHeaderCard({ currentUser }: TeachersPageHeaderCardProps) {
  return (
    <Card className="teachers-page__header-card bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Список преподавателей</CardTitle>
        <CardDescription>
          Выберите преподавателя, чтобы записаться на его курс. 
          {currentUser?.teacherName && currentUser.teacherName !== 'Преподаватель не назначен' && (
              <span> Ваш текущий преподаватель: <strong>{currentUser.teacherName}</strong>.</span>
          )}
          {currentUser?.teacherName === 'Преподаватель не назначен' && (
               <span> У вас пока нет назначенного преподавателя.</span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
