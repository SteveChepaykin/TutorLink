// src/app/teachers/page.tsx
'use client';

import type { User } from '@/services/user';
import { getTeachers, getCurrentUser, enrollStudentWithTeacher } from '@/services/user';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { School, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { TeachersPageHeaderCard } from './components/teachers-page__header-card';
import { TeachersPageTeacherCard } from './components/teachers-page__teacher-card';

export default function TeachersPage() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [teachers, setTeachers] = React.useState<User[]>([]);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [isLoadingTeachers, setIsLoadingTeachers] = React.useState(true);
  const [isEnrolling, setIsEnrolling] = React.useState<Record<string, boolean>>({});
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadInitialData() {
      setIsLoadingUser(true);
      setIsLoadingTeachers(true);
      try {
        const [userData, teachersData] = await Promise.all([
          getCurrentUser(),
          getTeachers(),
        ]);
        setCurrentUser(userData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные. Попробуйте обновить страницу.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUser(false);
        setIsLoadingTeachers(false);
      }
    }
    loadInitialData();
  }, [toast]);

  const handleEnroll = async (teacherId: string) => {
    if (!currentUser || currentUser.role !== 'student') {
      toast({
        title: 'Действие запрещено',
        description: 'Только студенты могут записываться к преподавателям.',
        variant: 'destructive',
      });
      return;
    }
    if (currentUser.teacherName && teachers.find(t => t.id === teacherId)?.name === currentUser.teacherName) {
        toast({
            title: 'Информация',
            description: 'Вы уже записаны к этому преподавателю.',
        });
        return;
    }

    setIsEnrolling(prev => ({ ...prev, [teacherId]: true }));
    try {
      const updatedStudentUser = await enrollStudentWithTeacher(currentUser.id, teacherId);
      setCurrentUser(updatedStudentUser); 
      toast({
        title: 'Успех!',
        description: `Вы успешно записались к преподавателю ${teachers.find(t => t.id === teacherId)?.name}.`,
      });
    } catch (error) {
      console.error('Ошибка записи к преподавателю:', error);
      toast({
        title: 'Ошибка записи',
        description: (error as Error).message || 'Не удалось записаться к преподавателю.',
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(prev => ({ ...prev, [teacherId]: false }));
    }
  };

  if (isLoadingUser || isLoadingTeachers) {
    return (
      <div className="teachers-page teachers-page--loading space-y-6">
        <Skeleton className="h-24 w-full" /> {/* Header card skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
             <Skeleton key={i} className="h-48 w-full" /> // Teacher card skeleton
          ))}
        </div>
      </div>
    );
  }
  
  if (currentUser?.role === 'teacher') {
    return (
      <div className="teachers-page teachers-page--teacher-view">
        <Alert variant="default" className="max-w-md mx-auto">
            <School className="h-6 w-6" />
            <AlertTitle className="text-xl font-semibold mt-2">Список преподавателей</AlertTitle>
            <AlertDescription className="mt-2 text-base">
              Эта страница предназначена для студентов. Преподаватели не могут записываться на курсы.
              Вы можете управлять своим списком студентов на странице{' '}
              <Link href="/profile" className="text-primary underline hover:text-primary/80">
                профиля
              </Link>.
            </AlertDescription>
          </Alert>
      </div>
    );
  }

  return (
    <div className="teachers-page space-y-6">
      <TeachersPageHeaderCard currentUser={currentUser} />

      {teachers.length === 0 && !isLoadingTeachers && (
        <Alert className="teachers-page__no-teachers-alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Нет доступных преподавателей</AlertTitle>
          <AlertDescription>
            В данный момент нет доступных преподавателей. Пожалуйста, проверьте позже.
          </AlertDescription>
        </Alert>
      )}

      <div className="teachers-page__list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <TeachersPageTeacherCard
            key={teacher.id}
            teacher={teacher}
            currentUser={currentUser}
            isEnrolling={isEnrolling[teacher.id] || false}
            onEnroll={handleEnroll}
          />
        ))}
      </div>
    </div>
  );
}
