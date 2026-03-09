import Navbar from "@/components/site/header/Navbar";
import { HomeBottomNav } from "@/components/site/bottom/BottomNav";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 pb-32"> 
        {children}
      </main>
      <HomeBottomNav />
    </div>
  );
}