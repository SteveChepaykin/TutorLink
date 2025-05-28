// src/app/profile/components/profile-page__student-list-card.tsx
'use client';

import { getStudentsForTeacher, addStudentToTeacherList } from '@/services/user';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { List, ListItem } from '@/components/ui/list';
import { UserPlus } from 'lucide-react';

interface ProfilePageStudentListCardProps {
  teacherId: string;
}

export function ProfilePageStudentListCard({ teacherId }: ProfilePageStudentListCardProps) {
  const [students, setStudents] = React.useState<string[]>([]);
  const [newStudentName, setNewStudentName] = React.useState('');
  const [isFetchingStudents, setIsFetchingStudents] = React.useState(true);
  const [isAddingStudent, setIsAddingStudent] = React.useState(false);
  const { toast } = useToast();

  const fetchStudentList = React.useCallback(async () => {
    setIsFetchingStudents(true);
    try {
        const studentList = await getStudentsForTeacher(teacherId);
        setStudents(studentList);
    } catch (error) {
        console.error("Ошибка загрузки списка студентов:", error);
        toast({
            title: "Ошибка",
            description: "Не удалось загрузить список студентов.",
            variant: "destructive",
        });
        setStudents([]); 
    } finally {
        setIsFetchingStudents(false);
    }
  }, [teacherId, toast]);

  React.useEffect(() => {
    if (teacherId) {
      fetchStudentList();
    }
  }, [teacherId, fetchStudentList]);

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) return;

    setIsAddingStudent(true);
    try {
      const updatedStudentList = await addStudentToTeacherList(newStudentName.trim());
      setStudents(updatedStudentList);
      setNewStudentName('');
      toast({
        title: 'Студент добавлен',
        description: `Студент "${newStudentName.trim()}" успешно добавлен/обновлен в вашем списке.`,
      });
    } catch (error) {
      console.error('Ошибка добавления студента:', error);
      toast({
        title: 'Ошибка',
        description: (error as Error).message || 'Не удалось добавить студента.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingStudent(false);
    }
  };

  return (
    <Card className="profile-page__student-list-card shadow-lg">
      <CardHeader className="profile-page__student-list-card-header">
        <CardTitle className="profile-page__student-list-card-title text-primary">Ваши студенты</CardTitle>
        <CardDescription className="profile-page__student-list-card-description">Список студентов, связанных с вашим аккаунтом репетитора.</CardDescription>
      </CardHeader>
      <CardContent className="profile-page__student-list-card-content space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-student">Добавить нового студента</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="new-student"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Имя студента"
              disabled={isAddingStudent}
              className="flex-grow"
            />
            <Button onClick={handleAddStudent} disabled={isAddingStudent || !newStudentName.trim()} size="icon" aria-label="Добавить студента">
              {isAddingStudent ? <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"/> : <UserPlus className="h-5 w-5"/>}
            </Button>
          </div>
        </div>
        
        {isFetchingStudents ? (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        ) : students.length > 0 ? (
            <List className="profile-page__student-list pt-2">
               {students.map((studentName, index) => (
                   <ListItem key={index} className="profile-page__student-list-item border-b py-1.5 last:border-b-0">
                     {studentName}
                   </ListItem>
                ))}
            </List>
        ) : (
          <p className="text-muted-foreground pt-2 text-sm">У вас пока нет студентов.</p>
        )}
      </CardContent>
    </Card>
  );
}
