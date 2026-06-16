function HeroSection() {
  const moveToSection = (sectionId) => {
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      <div className="content-container hero-layout">
        <div className="hero-text-area">
          <div className="hero-badge">Bucket Master</div>
          <h1 className="hero-title">스포츠 대진표를 쉽게 관리하세요</h1>
          <p className="hero-description">
            대회 생성부터 선수 등록, 대진표 확인까지 한 번에 할 수 있습니다.
          </p>

          <div className="hero-button-group">
            <button
              className="primary-button"
              type="button"
              onClick={() => moveToSection("features")}
            >
              대회 만들기
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => moveToSection("showcase")}
            >
              대진표 보기
            </button>
          </div>

          <div className="hero-info-list">
            <div className="hero-info-card">
              <strong>간단한 진행</strong>
              <span>초보자도 쉽게 사용할 수 있는 직관적인 화면</span>
            </div>
            <div className="hero-info-card">
              <strong>빠른 업데이트</strong>
              <span>승자 선택과 점수 수정 내용을 바로 반영</span>
            </div>
          </div>
        </div>

        <div className="hero-preview-card">
          <div className="hero-preview-header">
            <div>
              <p className="preview-label">오늘의 대회</p>
              <h2>2026 Summer League</h2>
            </div>
            <span className="preview-status">진행 중</span>
          </div>

          <div className="mini-bracket-list">
            <div className="mini-bracket-item">
              <span>블루 타이거즈</span>
              <strong>2</strong>
            </div>
            <div className="mini-bracket-item">
              <span>화이트 호크스</span>
              <strong>1</strong>
            </div>
            <div className="mini-bracket-divider" />
            <div className="mini-bracket-item">
              <span>서울 스파크</span>
              <strong>3</strong>
            </div>
            <div className="mini-bracket-item">
              <span>인천 스톰</span>
              <strong>2</strong>
            </div>
          </div>

          <div className="hero-summary-box">
            <div>
              <p>등록 선수</p>
              <strong>16명</strong>
            </div>
            <div>
              <p>진행 경기</p>
              <strong>8경기</strong>
            </div>
            <div>
              <p>다음 라운드</p>
              <strong>4강</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
