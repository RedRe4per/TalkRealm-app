import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Statistic from "@/components/Statistic";

export default function Home() {
  return (
    <>
      <main className="bg-primary">
        <Hero />
        <Feature />
        <Statistic />
      </main>
    </>
  );
}
