import Hero from "@/components/home/Hero";
import Countdown from "@/components/home/Countdown";
import WelcomeMessage from "@/components/home/WelcomeMessage";
import VenueCards from "@/components/home/VenueCards";
import Schedule from "@/components/home/Schedule";
import RsvpCta from "@/components/home/RsvpCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WelcomeMessage />
      <Countdown />
      <VenueCards />
      <Schedule />
      <RsvpCta />
    </>
  );
}
