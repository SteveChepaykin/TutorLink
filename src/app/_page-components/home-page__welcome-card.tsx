// src/app/_page-components/home-page__welcome-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, Video } from 'lucide-react';

export function HomePageWelcomeCard() {
  return (
    <Card className="home-page__welcome-card shadow-lg">
      <CardHeader className="home-page__welcome-card-header">
        <CardTitle className="home-page__welcome-card-title text-2xl text-primary">Добро пожаловать в TutorLink!</CardTitle>
        <CardDescription className="home-page__welcome-card-description">Ваша универсальная платформа для онлайн-репетиторства.</CardDescription>
      </CardHeader>
      <CardContent className="home-page__welcome-card-content">
        <p className="home-page__welcome-card-intro-text mb-4">Перемещайтесь по платформе с помощью боковой панели или быстрых ссылок ниже:</p>
        <div className="home-page__welcome-card-quick-links flex flex-col sm:flex-row gap-4">
          <Link href="/calendar" passHref legacyBehavior>
            <Button variant="secondary" className="home-page__calendar-button w-full sm:w-auto">
              <CalendarDays className="mr-2" />
              Просмотреть календарь конференций
            </Button>
          </Link>
          <Link href="/conference" passHref legacyBehavior>
            <Button variant="secondary" className="home-page__conference-button w-full sm:w-auto">
              <Video className="mr-2" />
              Присоединиться к тестовой конференции
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
