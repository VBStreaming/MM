import SectionHeading from "./SectionHeading";

const matchList = [
  {
    round: "8강",
    teamA: "블루 타이거즈",
    scoreA: 2,
    teamB: "화이트 호크스",
    scoreB: 1,
    status: "경기 종료",
  },
  {
    round: "8강",
    teamA: "서울 스파크",
    scoreA: 3,
    teamB: "인천 스톰",
    scoreB: 2,
    status: "승자 확정",
  },
  {
    round: "4강",
    teamA: "레드 애로우",
    scoreA: 1,
    teamB: "그린 울브스",
    scoreB: 1,
    status: "점수 수정 가능",
  },
  {
    round: "결승",
    teamA: "챔피언스 FC",
    scoreA: 0,
    teamB: "드림 유나이티드",
    scoreB: 0,
    status: "경기 예정",
  },
];

function BracketPreviewSection() {
  return (
    <section className="preview-section">
      <div className="content-container">
        <SectionHeading
          label="예시 대진표"
          title="실제 서비스처럼 경기 카드로 빠르게 확인할 수 있습니다"
          description="점수와 경기 상태를 바로 보여줘서 현재 진행 상황을 쉽게 파악할 수 있습니다."
        />

        <div className="match-grid">
          {matchList.map((match) => (
            <article className="match-card" key={`${match.round}-${match.teamA}`}>
              <div className="match-card-header">
                <span className="match-round">{match.round}</span>
                <span className="match-status">{match.status}</span>
              </div>

              <div className="team-row">
                <span>{match.teamA}</span>
                <strong>{match.scoreA}</strong>
              </div>
              <div className="team-row">
                <span>{match.teamB}</span>
                <strong>{match.scoreB}</strong>
              </div>

              <div className="match-card-footer">승자 선택 및 점수 수정 가능</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BracketPreviewSection;
