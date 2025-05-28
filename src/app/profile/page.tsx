// src/app/profile/page.tsx
'use client';

import type { User } from '@/services/user';
import { getCurrentUser, updateUser, getStudentsForTeacher, addStudentToTeacherList } from '@/services/user';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

import { ProfilePageEditCard } from './components/profile-page__edit-card';
import { ProfilePageStudentListCard } from './components/profile-page__student-list-card';
import { ProfilePageStudentTeacherInfo } from './components/profile-page__student-teacher-info';


export default function ProfilePage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<'teacher' | 'student' | undefined>(undefined);
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const { toast } = useToast();

  const loadUserData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUserData = await getCurrentUser();
      setUser(currentUserData);
      setName(currentUserData.name);
      setRole(currentUserData.role);
      // Student list and teacher name will be handled by their respective components
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные профиля.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadUserData();
  }, [loadUserData]);


  const handleSaveChanges = async (updatedName: string, updatedRole: 'teacher' | 'student') => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedUser = await updateUser({ name: updatedName, role: updatedRole });
      setUser(updatedUser); 
      setName(updatedUser.name); 
      setRole(updatedUser.role);

      // Re-trigger data load to refresh dependent components like student list or teacher name
      await loadUserData(); 

      toast({
        title: 'Успех',
        description: 'Ваш профиль успешно обновлен.',
      });
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль.',
        variant: 'destructive',
      });
       if (user) { // Rollback optimistic UI update if actual user data is available
         setName(user.name);
         setRole(user.role);
       }
    } finally {
      setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <div className="profile-page profile-page--loading space-y-6 max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
        <Card className="shadow-lg">
           <CardHeader>
             <Skeleton className="h-8 w-1/3" />
           </CardHeader>
           <CardContent>
             <Skeleton className="h-20 w-full" />
           </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <p className="profile-page profile-page--error text-center text-destructive">Не удалось загрузить данные профиля.</p>;
  }

  return (
    <div className="profile-page space-y-6 max-w-2xl mx-auto">
      <ProfilePageEditCard
        user={user}
        currentName={name}
        currentRole={role}
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onNameChange={setName}
        onRoleChange={setRole}
      />

      {role === 'student' && user && (
        <ProfilePageStudentTeacherInfo 
          teacherName={user.teacherName} 
        />
      )}

      {role === 'teacher' && user && (
        <ProfilePageStudentListCard 
          teacherId={user.id} 
          key={user.id} // Add key to force re-render if teacherId changes (e.g. after role change)
        />
      )}
    </div>
  );
}

