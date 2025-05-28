// src/app/profile/components/profile-page__student-teacher-info.tsx
'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface ProfilePageStudentTeacherInfoProps {
  teacherName: string | undefined;
}

export function ProfilePageStudentTeacherInfo({ teacherName }: ProfilePageStudentTeacherInfoProps) {
  return (
    <div className="profile-page__student-teacher-info space-y-2 pt-2">
      <Label>Ваш преподаватель</Label>
      <div className="text-sm text-muted-foreground p-3 border rounded-md bg-secondary/20">
        {teacherName && teacherName !== 'Преподаватель не назначен' ? (
          teacherName
        ) : (
          <>
            <span>Преподаватель не назначен. </span>
            <Link href="/teachers" className="text-primary hover:underline">
               Выбрать преподавателя?
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
