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
      {/* 랜딩페이지 분위기를 만드는 배경 장식 */}
      <div className="landing-page__background" />

      {/* 랜딩페이지를 상단바, 소개, 기능, 미리보기, 푸터 순서로 조립 */}
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
