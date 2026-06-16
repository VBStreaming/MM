import SectionHeading from "./SectionHeading";

const featureList = [
  {
    number: "01",
    title: "대회 생성",
    description:
      "리그전과 토너먼트 대회를 빠르게 만들고 진행 방식을 보기 쉽게 정리할 수 있습니다.",
  },
  {
    number: "02",
    title: "선수 등록",
    description:
      "선수와 팀 정보를 간단하게 입력하고 참가자 목록을 한눈에 확인할 수 있습니다.",
  },
  {
    number: "03",
    title: "대진표 확인",
    description:
      "라운드별 경기 흐름을 카드 형태로 깔끔하게 보여줘서 진행 상태를 쉽게 볼 수 있습니다.",
  },
  {
    number: "04",
    title: "대진표 수정",
    description:
      "승자 선택과 점수 입력을 빠르게 처리해서 경기 결과를 바로 업데이트할 수 있습니다.",
  },
];

function FeatureSection() {
  return (
    <section className="feature-section" id="features">
      <div className="content-container">
        <SectionHeading
          label="핵심 기능"
          title="대회 운영에 필요한 기능을 한곳에 모았습니다"
          description="필요한 정보만 깔끔하게 보여주는 카드 UI로 누구나 쉽게 사용할 수 있습니다."
        />

        <div className="feature-grid">
          {featureList.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
