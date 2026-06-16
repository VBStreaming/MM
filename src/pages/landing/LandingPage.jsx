import HeroSection from "../../components/landing/HeroSection";
import FeatureSection from "../../components/landing/FeatureSection";
import BracketPreviewSection from "../../components/landing/BracketPreviewSection";
import ShowcaseSection from "../../components/landing/ShowcaseSection";
import FooterSection from "../../components/landing/FooterSection";
import TopBar from "../../components/landing/TopBar";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-page__background" />
      <TopBar />
      <HeroSection />
      <FeatureSection />
      <BracketPreviewSection />
      <ShowcaseSection />
      <FooterSection />
    </div>
  );
}

export default LandingPage;
