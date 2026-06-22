import "./MyPage.css";
import { Link } from "react-router-dom";
import {
    formatDateLabel,
    getCompetitions,
    getCompetitionStatusInfo,
    getCurrentUser,
    getProfile,
    getSelectedCompetition,
    logoutUser,
    setSelectedCompetitionId,
} from "../../utils/localData";

function Icon({ name }) {
    const icons = {
        dashboard: (
            <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7ZM6 6v3h3V6H6Zm9 0v3h3V6h-3ZM6 15v3h3v-3H6Zm9 0v3h3v-3h-3Z" />
        ),
        trophy: (
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M8 4h8v7a4 4 0 0 1-8 0V4Z" />
                <path d="M6 7H4v2a5 5 0 0 0 4 4.9" />
                <path d="M18 7h2v2a5 5 0 0 1-4 4.9" />
                <path d="M12 15v4" />
                <path d="M8 20h8" />
            </g>
        ),
        users: (
            <path d="M9 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7-1a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM3 20a6 6 0 0 1 12 0H3Zm2.2-2h7.6a4 4 0 0 0-7.6 0ZM15 14a5 5 0 0 1 5 5h-2a3 3 0 0 0-3-3v-2Z" />
        ),
        chart: (
            <path d="M5 19h14v2H3V4h2v15Zm2-2V9h3v8H7Zm5 0V5h3v12h-3Zm5 0v-6h3v6h-3Z" />
        ),
        support: (
            <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm-1 10h2v2h-2v-2Zm1-8a3 3 0 0 1 3 3c0 1.2-.7 2-1.7 2.6-.8.5-1.1.8-1.1 1.4H10c0-1.4.8-2.2 1.8-2.8.8-.5 1.2-.8 1.2-1.4A1 1 0 0 0 12 9a1 1 0 0 0-1 1H9a3 3 0 0 1 3-3Z" />
        ),
        logout: (
            <path d="M5 4h8v2H7v12h6v2H5V4Zm10 4 5 4-5 4v-3H10v-2h5V8Z" />
        ),
        bell: (
            <path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22Zm-6-4h12l-1.5-2.2V11a4.6 4.6 0 0 0-3.5-4.5V4a1 1 0 0 0-2 0v2.5A4.6 4.6 0 0 0 7.5 11v4.8L6 18Z" />
        ),
        settings: (
            <path d="M19.4 13.5a7.3 7.3 0 0 0 0-3l2-1.5-2-3.4-2.4 1a7.4 7.4 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6A7.4 7.4 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5a7.3 7.3 0 0 0 0 3l-2 1.5 2 3.4 2.4-1a7.4 7.4 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
        ),
        card: (
            <path d="M4 5h16v14H4V5Zm2 3v2h12V8H6Zm0 5v4h12v-4H6Zm2 1h3v2H8v-2Z" />
        ),
        archive: (
            <path d="M4 4h16v5H4V4Zm2 2v1h12V6H6Zm1 5h10v9H7v-9Zm3 3v2h4v-2h-4Z" />
        ),
    };

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            {icons[name]}
        </svg>
    );
}

function MyPage() {
    const currentUser = getCurrentUser();
    const profile = getProfile();
    const competitions = getCompetitions();
    const selectedCompetition = getSelectedCompetition();
    const bracketLink = selectedCompetition ? `/bracket/${selectedCompetition.id}` : "/bracket";
    const completedCount = competitions.filter((competition) => (
        getCompetitionStatusInfo(competition.startDate, competition.endDate).statusKey === "ended"
    )).length;
    const activeCount = competitions.filter((competition) => (
        getCompetitionStatusInfo(competition.startDate, competition.endDate).statusKey !== "ended"
    )).length;
    const completionRate = competitions.length === 0
        ? 0
        : Math.round((completedCount / competitions.length) * 100);
    const sidebarItems = [
        { label: "대시보드", icon: "dashboard", to: "/mypage" },
        { label: "내 대회", icon: "trophy", to: "/competitions" },
        { label: "대회 만들기", icon: "users", to: "/competitions/new" },
        { label: "대진표", icon: "chart", to: bracketLink },
    ];
    const latestCompetitions = competitions.slice(0, 3);
    const initial = (profile.name || currentUser?.name || "?").slice(0, 1).toUpperCase();

    const handleLogout = () => {
        logoutUser();
        window.location.assign("/");
    };

    if (!currentUser) {
        return (
            <div className="mypage-shell mypage-shell--auth">
                <div className="mypage-main mypage-main--centered">
                    <main className="mypage-content">
                        <section className="mypage-card mypage-auth-card">
                            <h1>로그인이 필요합니다.</h1>
                            <p>마이페이지를 보려면 먼저 로그인하거나 회원가입을 진행해주세요.</p>
                            <div className="mypage-auth-actions">
                                <Link
                                    className="mypage-edit-button"
                                    to={{ pathname: "/login", state: { redirectTo: "/mypage" } }}
                                >
                                    로그인
                                </Link>
                                <Link className="mypage-auth-secondary" to="/signup">회원가입</Link>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="mypage-shell">
            <aside className="mypage-sidebar">
                <div className="mypage-brand">
                    <strong>배민</strong>
                    <span>관리 화면</span>
                </div>

                <nav className="mypage-side-nav" aria-label="대시보드 메뉴">
                    {sidebarItems.map((item) => (
                        <Link to={item.to} key={item.label}>
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mypage-side-footer">
                    <Link to="/">
                        <Icon name="support" />
                        <span>홈</span>
                    </Link>
                    <button type="button" className="mypage-side-button" onClick={handleLogout}>
                        <Icon name="logout" />
                        <span>로그아웃</span>
                    </button>
                </div>
            </aside>

            <div className="mypage-main">
                <header className="mypage-topbar">
                    <nav aria-label="주요 메뉴">
                        <Link to="/competitions">대회 목록</Link>
                        <Link to={bracketLink}>대진표</Link>
                        <Link to="/competitions/new">대회 생성</Link>
                        <Link to="/">홈</Link>
                    </nav>

                    <div className="mypage-top-actions">
                        <button type="button" aria-label="알림">
                            <Icon name="bell" />
                        </button>
                        <button type="button" aria-label="설정">
                            <Icon name="settings" />
                        </button>
                        <Link
                            className="mypage-mini-avatar"
                            to="/mypage"
                            aria-label="마이페이지로 이동"
                            title="마이페이지"
                        >
                            <span>{initial}</span>
                        </Link>
                    </div>
                </header>

                <main className="mypage-content">
                    <section className="mypage-profile-header">
                        <div className="mypage-profile-main">
                            <div className="mypage-avatar">
                                <span>{initial}</span>
                            </div>

                            <div>
                                <h1>{profile.name}</h1>
                                <p>{profile.role}</p>
                            </div>
                        </div>

                        <Link className="mypage-edit-button" to="/competitions/new">새 대회 만들기</Link>
                    </section>

                    <section className="mypage-card-grid">
                        <article className="mypage-card mypage-info-card">
                            <div className="mypage-card-header">
                                <h2>개인 정보</h2>
                                <Icon name="card" />
                            </div>

                            <dl className="mypage-info-list">
                                <div>
                                    <dt>이름</dt>
                                    <dd>{profile.name}</dd>
                                </div>
                                <div>
                                    <dt>학번</dt>
                                    <dd>{profile.studentId}</dd>
                                </div>
                            </dl>
                        </article>

                        <article className="mypage-card mypage-status-card">
                            <span className="mypage-muted-label">계정 상태</span>
                            <div className="mypage-status-row">
                                <span className="mypage-status-dot" />
                                <strong>활성 사용자</strong>
                            </div>

                            <div className="mypage-status-summary">
                                <span>진행 중 또는 접수 중 대회</span>
                                <strong>{activeCount}개</strong>
                            </div>

                            <div className="mypage-progress-wrap">
                                <div className="mypage-progress-label">
                                    <span>종료된 대회 비율</span>
                                    <strong>{completionRate}%</strong>
                                </div>
                                <div className="mypage-progress-track">
                                    <span style={{ width: `${completionRate}%` }} />
                                </div>
                            </div>
                        </article>
                    </section>

                    <section className="mypage-card mypage-tournament-card">
                        <div className="mypage-card-header">
                            <h2>최근 대회</h2>
                            <span className="mypage-pill">총 {competitions.length}개</span>
                        </div>

                        {latestCompetitions.length === 0 ? (
                            <div className="mypage-empty-state">
                                <div className="mypage-empty-icon">
                                    <Icon name="archive" />
                                </div>
                                <h3>준비 중</h3>
                                <p>아직 저장된 대회가 없습니다.<br />새로운 토너먼트를 먼저 생성해주세요.</p>
                            </div>
                        ) : (
                            <div className="mypage-competition-list">
                                {latestCompetitions.map((competition) => {
                                    const status = getCompetitionStatusInfo(competition.startDate, competition.endDate);

                                    return (
                                        <article className="mypage-competition-item" key={competition.id}>
                                            <div className="mypage-competition-copy">
                                                <span className={`mypage-competition-badge ${status.statusKey}`}>
                                                    {status.label}
                                                </span>
                                                <h3>{competition.title}</h3>
                                                <p>
                                                    {formatDateLabel(competition.startDate)} - {formatDateLabel(competition.endDate)}
                                                </p>
                                            </div>

                                            <div className="mypage-competition-meta">
                                                <strong>{competition.participants.length} / {competition.maxParticipants}명</strong>
                                                <Link
                                                    to={`/bracket/${competition.id}`}
                                                    onClick={() => setSelectedCompetitionId(competition.id)}
                                                >
                                                    대진표 보기
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>

                <footer className="mypage-footer">
                    <p><strong>배민</strong> 로컬 데이터 기반으로 연결된 대회 관리 화면입니다.</p>
                    <nav aria-label="빠른 링크">
                        <Link to="/">홈</Link>
                        <Link to="/competitions">대회 목록</Link>
                        <Link to="/competitions/new">대회 생성</Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export default MyPage;
