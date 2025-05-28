// src/app/teachers/components/teachers-page__teacher-card.tsx
'use client';

import type { User } from '@/services/user';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface TeachersPageTeacherCardProps {
  teacher: User;
  currentUser: User | null;
  isEnrolling: boolean;
  onEnroll: (teacherId: string) => void;
}

export function TeachersPageTeacherCard({
  teacher,
  currentUser,
  isEnrolling,
  onEnroll,
}: TeachersPageTeacherCardProps) {
  const isCurrentUserTeacher = currentUser?.teacherName === teacher.name;

  return (
    <Card key={teacher.id} className="teachers-page__teacher-card shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{teacher.name}</CardTitle>
        <CardDescription className="text-base">Предмет: {teacher.subject || 'Не указан'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Студентов: {teacher.students?.length || 0}
        </p>
      </CardContent>
      <CardFooter>
        {currentUser?.role === 'student' && (
          isCurrentUserTeacher ? (
            <Button variant="outline" disabled className="w-full">
              <UserCheck className="mr-2 h-4 w-4" />
              Вы записаны
            </Button>
          ) : (
            <Button 
              onClick={() => onEnroll(teacher.id)} 
              disabled={isEnrolling || !currentUser}
              className="w-full"
            >
              {isEnrolling ? 'Запись...' : 'Записаться'}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}

