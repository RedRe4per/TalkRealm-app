import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Statistic from "@/components/Statistic";
import Footer from "@/components/Layouts/Footer";

export default function Home() {
  return (
    <>
      <main className="bg-primary">
        <Hero />
        <Feature />
        <Statistic />
        <Footer />
      </main>
    </>
  );
}
