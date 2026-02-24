import { Header } from "@/components/landing_page/Header";
import { Hero } from "@/components/landing_page/Hero";
import { Footer } from "@/components/landing_page/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
