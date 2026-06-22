import { useState } from "react";
import SectionHeading from "./SectionHeading";

// 슬라이드에 보여줄 화면 설명 데이터를 배열로 분리
const showcaseSlides = [
  {
    id: 1,
    title: "대회 생성 화면",
    description:
      "대회 이름, 경기 방식, 참가 규모를 입력해서 새 대회를 빠르게 시작할 수 있습니다.",
    tag: "Create",
    items: ["대회 이름 입력", "리그전 / 토너먼트 선택", "일정과 라운드 설정"],
  },
  {
    id: 2,
    title: "선수 등록 화면",
    description:
      "참가 선수와 팀을 한 번에 추가하고 목록을 정리해서 관리할 수 있습니다.",
    tag: "Players",
    items: ["선수 이름 등록", "팀별 참가자 구분", "시드 배정 확인"],
  },
  {
    id: 3,
    title: "대진표 관리 화면",
    description:
      "경기 결과를 누르기만 해도 승자와 점수가 바로 반영되는 흐름을 보여줍니다.",
    tag: "Bracket",
    items: ["승자 선택", "점수 수정", "다음 라운드 자동 반영"],
  },
];

function ShowcaseSection() {
  // 현재 몇 번째 화면을 보여줄지 상태값 하나로 관리
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = showcaseSlides[currentIndex];

  // 첫 번째 화면에서는 마지막 화면으로 순환
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return showcaseSlides.length - 1;
      }

      return prevIndex - 1;
    });
  };

  // 마지막 화면에서는 다시 첫 번째 화면으로 순환
  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === showcaseSlides.length - 1) {
        return 0;
      }

      return prevIndex + 1;
    });
  };

  return (
    <section className="showcase-section" id="showcase">
      <div className="content-container">
        <SectionHeading
          label="서비스 화면"
          title="아래 화면을 넘기면서 서비스 흐름을 살펴볼 수 있습니다"
          description="useState로 현재 화면 번호를 바꾸는 간단한 방식이라 초보자도 이해하기 쉽습니다."
        />

        <div className="showcase-card">
          <div className="showcase-toolbar">
            <div>
              <p className="showcase-mini-label">현재 화면</p>
              <h3>{currentSlide.title}</h3>
            </div>

            <div className="showcase-button-group">
              {/* 이전 슬라이드로 이동 */}
              <button className="slide-button" type="button" onClick={goToPrevious}>
                이전
              </button>
              {/* 다음 슬라이드로 이동 */}
              <button className="slide-button slide-button--primary" type="button" onClick={goToNext}>
                다음
              </button>
            </div>
          </div>

          <div className="showcase-screen">
            <div className="screen-top-bar">
              <span />
              <span />
              <span />
            </div>

            <div className="screen-body">
              <div className="screen-side-panel">
                <div className="screen-tag">{currentSlide.tag}</div>
                <h4>{currentSlide.title}</h4>
                <p>{currentSlide.description}</p>
              </div>

              <div className="screen-main-panel">
                {currentSlide.items.map((item) => (
                  <div className="screen-line-card" key={item}>
                    <div className="screen-line-card__bar" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="showcase-dots">
            {showcaseSlides.map((slide, index) => (
              <button
                key={slide.id}
                className={index === currentIndex ? "showcase-dot showcase-dot--active" : "showcase-dot"}
                type="button"
                // 점 버튼을 누르면 해당 화면으로 바로 이동
                onClick={() => setCurrentIndex(index)}
                aria-label={`${slide.title} 보기`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
