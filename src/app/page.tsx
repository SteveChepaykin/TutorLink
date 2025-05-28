import { HomePageWelcomeCard } from './_page-components/home-page__welcome-card';
import { HomePageGettingStartedCard } from './_page-components/home-page__getting-started-card';

export default function Home() {
  return (
    <div className="home-page space-y-6">
      <HomePageWelcomeCard />
      <HomePageGettingStartedCard />
    </div>
  );
}
