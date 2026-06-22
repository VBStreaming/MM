import "./MyPage.css";
import { Link, useHistory } from "react-router-dom";
import { getCurrentUser, getUserInitial, logoutUser } from "../../utils/authStorage";
import { getCompetitionsByUser } from "../../utils/competitionStorage";

const sidebarItems = [
    {
        label: "Dashboard",
        icon: "dashboard",
    },
    {
        label: "My Tournaments",
        icon: "trophy",
    },
    {
        label: "Participants",
        icon: "users",
    },
    {
        label: "Results",
        icon: "chart",
    },
];

function Icon({ name }) {
    const icons = {
        dashboard: (
            <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7ZM6 6v3h3V6H6Zm9 0v3h3V6h-3ZM6 15v3h3v-3H6Zm9 0v3h3v-3h-3Z" />
        ),
        trophy: (
            <path d="M8 4h8v3h4v2a6 6 0 0 1-5.2 5.9A4 4 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1a4 4 0 0 1-1.8-2A6 6 0 0 1 4 9V7h4V4Zm8 5V6h-6v6.5a3 3 0 0 0 6 0V9Zm2 0v3.7A4 4 0 0 0 20 9h-2ZM6 9a4 4 0 0 0 2 3.7V9H6Z" />
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
        camera: (
            <path d="M9 4h6l1.3 2H20v14H4V6h3.7L9 4Zm3 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
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
    const history = useHistory();
    const currentUser = getCurrentUser();
    const profile = currentUser || {
        fullName: "Guest User",
        studentId: "----",
        email: "로그인 후 표시됩니다",
        role: "로그인이 필요합니다",
    };
    const joinedDate = currentUser?.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString("ko-KR")
        : "-";
    const initial = getUserInitial(currentUser);
    const myCompetitions = getCompetitionsByUser(currentUser?.id);

    const handleLogout = () => {
        logoutUser();
        history.push("/login");
    };

    const handleEditProfile = () => {
        if (!currentUser) {
            history.push("/login");
        }
    };

    return (
        <div className="mypage-shell">
            <aside className="mypage-sidebar">
                <div className="mypage-brand">
                    <strong>BracketMaster</strong>
                    <span>Admin Panel</span>
                </div>

                <nav className="mypage-side-nav" aria-label="Dashboard navigation">
                    {sidebarItems.map((item) => (
                        <Link to="/mypage" key={item.label}>
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mypage-side-footer">
                    <Link to="/support">
                        <Icon name="support" />
                        <span>Support</span>
                    </Link>
                    <button type="button" onClick={handleLogout}>
                        <Icon name="logout" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="mypage-main">
                <header className="mypage-topbar">
                    <nav aria-label="Main navigation">
                        <Link to="/competitions">Tournaments</Link>
                        <Link to="/bracket">Brackets</Link>
                        <Link to="/teams">Teams</Link>
                        <Link to="/schedule">Schedule</Link>
                    </nav>

                    <div className="mypage-top-actions">
                        <button type="button" aria-label="Notifications">
                            <Icon name="bell" />
                        </button>
                        <button type="button" aria-label="Settings">
                            <Icon name="settings" />
                        </button>
                        <div className="mypage-mini-avatar" aria-label="User profile">
                            <span>{initial}</span>
                        </div>
                    </div>
                </header>

                <main className="mypage-content">
                    <section className="mypage-profile-header">
                        <div className="mypage-profile-main">
                            <div className="mypage-avatar">
                                <span>{initial}</span>
                                <button type="button" aria-label="Change profile photo">
                                    <Icon name="camera" />
                                </button>
                            </div>

                            <div>
                                <h1>{profile.fullName}</h1>
                                <p>{profile.role}</p>
                            </div>
                        </div>

                        <button className="mypage-edit-button" type="button" onClick={handleEditProfile}>
                            {currentUser ? "프로필 수정" : "로그인하기"}
                        </button>
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
                                    <dd>{profile.fullName}</dd>
                                </div>
                                <div>
                                    <dt>학번</dt>
                                    <dd>{profile.studentId}</dd>
                                </div>
                                <div>
                                    <dt>이메일</dt>
                                    <dd>{profile.email}</dd>
                                </div>
                                <div>
                                    <dt>가입일</dt>
                                    <dd>{joinedDate}</dd>
                                </div>
                            </dl>
                        </article>

                        <article className="mypage-card mypage-status-card">
                            <span className="mypage-muted-label">계정 상태</span>
                            <div className="mypage-status-row">
                                <span className={currentUser ? "mypage-status-dot" : "mypage-status-dot is-offline"} />
                                <strong>{currentUser ? "활성 사용자" : "로그인 필요"}</strong>
                            </div>

                            <div className="mypage-progress-wrap">
                                <div className="mypage-progress-label">
                                    <span>토너먼트 완료율</span>
                                    <strong>85%</strong>
                                </div>
                                <div className="mypage-progress-track">
                                    <span />
                                </div>
                            </div>
                        </article>
                    </section>

                    <section className="mypage-card mypage-tournament-card">
                        <div className="mypage-card-header">
                            <h2>참가 대회 정보</h2>
                            <span className="mypage-pill">{myCompetitions.length} SAVED</span>
                        </div>

                        {myCompetitions.length > 0 ? (
                            <div className="mypage-competition-list">
                                {myCompetitions.map((competition) => (
                                    <article className="mypage-competition-item" key={competition.id}>
                                        <div>
                                            <span>{competition.type}</span>
                                            <h3>{competition.title}</h3>
                                            <p>{competition.progressPeriod}</p>
                                        </div>
                                        <strong>{competition.status}</strong>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mypage-empty-state">
                                <div className="mypage-empty-icon">
                                    <Icon name="archive" />
                                </div>
                                <h3>준비 중</h3>
                                <p>현재 저장된 대회가 없습니다.<br />새로운 토너먼트를 개최하거나 참가 신청을 기다려주세요.</p>
                            </div>
                        )}
                    </section>
                </main>

                <footer className="mypage-footer">
                    <p><strong>BracketMaster Pro</strong> © 2026 BracketMaster Pro. All rights reserved.</p>
                    <nav aria-label="Legal links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/support">Contact Support</Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export default MyPage;
