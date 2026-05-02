import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Prologue from "./components/Prologue";
import ChapterOrigin from "./components/ChapterOrigin";
import ChapterEra80 from "./components/ChapterEra80";
import ChapterBrand from "./components/ChapterBrand";
import ChapterName from "./components/ChapterName";
import ChapterMission from "./components/ChapterMission";
import ChapterBelief from "./components/ChapterBelief";
import Closing from "./components/Closing";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Prologue />
      <ChapterOrigin />
      <ChapterEra80 />
      <ChapterBrand />
      <ChapterName />
      <ChapterMission />
      <ChapterBelief />
      <Closing />
      <Footer />
    </main>
  );
}
