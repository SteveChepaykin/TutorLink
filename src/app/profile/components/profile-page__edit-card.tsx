// src/app/profile/components/profile-page__edit-card.tsx
'use client';

import type { User } from '@/services/user';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProfilePageEditCardProps {
  user: User;
  currentName: string;
  currentRole: 'teacher' | 'student' | undefined;
  isSaving: boolean;
  onSave: (name: string, role: 'teacher' | 'student') => void;
  onNameChange: (name: string) => void;
  onRoleChange: (role: 'teacher' | 'student') => void;
}

export function ProfilePageEditCard({
  user,
  currentName,
  currentRole,
  isSaving,
  onSave,
  onNameChange,
  onRoleChange,
}: ProfilePageEditCardProps) {
  
  const handleSaveChangesClick = () => {
    if (currentRole) {
      onSave(currentName, currentRole);
    }
  };
  
  const canSaveChanges = (currentName !== user.name || currentRole !== user.role) && !!currentRole && currentName.trim() !== '';

  return (
    <Card className="profile-page__edit-card shadow-lg">
      <CardHeader className="profile-page__edit-card-header">
        <CardTitle className="profile-page__edit-card-title text-primary">Редактировать профиль</CardTitle>
        <CardDescription className="profile-page__edit-card-description">Обновите ваше имя и статус.</CardDescription>
      </CardHeader>
      <CardContent className="profile-page__edit-card-content space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            value={currentName}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label>Статус</Label>
          <RadioGroup
            value={currentRole}
            onValueChange={(value) => onRoleChange(value as 'teacher' | 'student')}
            className="flex space-x-4"
            disabled={isSaving}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teacher" id="role-teacher" />
              <Label htmlFor="role-teacher">Репетитор</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="role-student" />
              <Label htmlFor="role-student">Студент</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="profile-page__edit-card-footer">
        <Button onClick={handleSaveChangesClick} disabled={isSaving || !canSaveChanges}>
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </CardFooter>
    </Card>
  );
}
