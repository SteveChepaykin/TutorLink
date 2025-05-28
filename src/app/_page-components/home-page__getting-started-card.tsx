// src/app/_page-components/home-page__getting-started-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePageGettingStartedCard() {
  return (
    <Card className="home-page__getting-started-card">
      <CardHeader className="home-page__getting-started-card-header">
        <CardTitle className="home-page__getting-started-card-title">Начало работы</CardTitle>
      </CardHeader>
      <CardContent className="home-page__getting-started-card-content">
        <p className="home-page__getting-started-card-text">
          Изучите календарь, чтобы увидеть запланированные сессии, или перейдите на страницу тестовой конференции, чтобы
          ознакомиться с видеоинтерфейсом.
        </p>
      </CardContent>
    </Card>
  );
}
