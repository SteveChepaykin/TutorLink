import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Toaster} from '@/components/ui/toaster';
import Link from 'next/link';
import {CalendarDays, Video, User, Users} from 'lucide-react';
import { getCurrentUser } from '@/services/user';
import type { User as CurrentUserType } from '@/services/user';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TutorLink',
  description: 'Ваша система управления обучением',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentUser: CurrentUserType | null = null;
  try {
    currentUser = await getCurrentUser();
  } catch (error) {
    console.error("Не удалось загрузить пользователя в layout:", error);
    // Можно обработать ошибку или продолжить с currentUser как null
  }

  const isTeacher = currentUser?.role === 'teacher';

  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <h1 className="text-xl font-semibold text-primary">TutorLink</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/profile" legacyBehavior passHref>
                    <SidebarMenuButton>
                      <User />
                      Профиль
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/calendar" legacyBehavior passHref>
                    <SidebarMenuButton>
                      <CalendarDays />
                      Календарь
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  {isTeacher ? (
                    <SidebarMenuButton disabled>
                      <Users />
                      Преподаватели
                    </SidebarMenuButton>
                  ) : (
                    <Link href="/teachers" legacyBehavior passHref>
                      <SidebarMenuButton>
                        <Users />
                        Преподаватели
                      </SidebarMenuButton>
                    </Link>
                  )}
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/conference" legacyBehavior passHref>
                    <SidebarMenuButton>
                      <Video />
                      Конференция
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex items-center justify-between p-4 border-b bg-card md:justify-start">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-lg font-semibold">Добро пожаловать</h2>
            </header>
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
