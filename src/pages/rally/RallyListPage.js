import { useState } from "react";
import { Link } from "react-router-dom";
import "./RallyListPage.css";

const rallies = [
    {
        id: 1,
        type: "LEAGUE",
        title: "2024 스프링 마스터즈 리그",
        registrationPeriod: "2024.02.01 - 02.25",
        progressPeriod: "2024.03.01 - 05.31",
        participants: 24,
        capacity: 32,
        status: "진행 중",
        statusKey: "active",
    },
    {
        id: 2,
        type: "TOURNAMENT",
        title: "아마추어 챌린지 컵",
        registrationPeriod: "2024.05.20 - 06.10",
        progressPeriod: "2024.06.15 - 06.20",
        participants: 12,
        capacity: 16,
        status: "접수 중",
        statusKey: "recruiting",
    },
    {
        id: 3,
        type: "TOURNAMENT",
        title: "윈터 프리미어 인비테이셔널",
        registrationPeriod: "2023.12.15 - 12.30",
        progressPeriod: "2024.01.10 - 01.25",
        participants: 64,
        capacity: 64,
        status: "종료",
        statusKey: "ended",
    },
    {
        id: 4,
        type: "LEAGUE",
        title: "K-이스포츠 대학교 대항전",
        registrationPeriod: "2024.03.15 - 04.10",
        progressPeriod: "2024.04.15 - 06.15",
        participants: 128,
        capacity: 256,
        status: "진행 중",
        statusKey: "active",
    },
];

const tabs = [
    { label: "전체", value: "all" },
    { label: "접수 중", value: "recruiting" },
    { label: "진행 중", value: "active" },
    { label: "종료", value: "ended" },
];

function Icon({ name }) {
    const icons = {
        plus: <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />,
        calendar: (
            <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm11 8H6v10h12V10ZM6 8h12V6H6v2Zm3 4h2v2H9v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2H9v-2Zm4 0h2v2h-2v-2Z" />
        ),
        dots: (
            <path d="M7 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm7-10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm7-10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
        ),
        chevronLeft: <path d="m15.4 5.4 1.2 1.2L11.2 12l5.4 5.4-1.2 1.2L8.8 12l6.6-6.6Z" />,
        chevronRight: <path d="m8.6 18.6-1.2-1.2 5.4-5.4-5.4-5.4 1.2-1.2 6.6 6.6-6.6 6.6Z" />,
    };

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            {icons[name]}
        </svg>
    );
}

function RallyListPage() {
    const [activeTab, setActiveTab] = useState("all");
    const filteredRallies = activeTab === "all"
        ? rallies
        : rallies.filter((rally) => rally.statusKey === activeTab);

    return (
        <main className="rally-list-page">
            <section className="rally-list-shell" aria-labelledby="rally-list-title">
                <header className="rally-list-header">
                    <div>
                        <h1 id="rally-list-title">대회 목록</h1>
                        <p>참여 중이거나 관리 중인 토너먼트를 한눈에 확인하세요.</p>
                    </div>

                    <Link className="rally-create-button" to="/competitions/new">
                        <Icon name="plus" />
                        <span>대회 생성하기</span>
                    </Link>
                </header>

                <nav className="rally-tabs" aria-label="대회 상태 필터">
                    {tabs.map((tab) => (
                        <button
                            className={tab.value === activeTab ? "active" : ""}
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            type="button"
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <section className="rally-table" aria-label="대회 목록">
                    <div className="rally-table-head">
                        <span>대회 정보</span>
                        <span>접수 및 진행 기간</span>
                        <span>참여 인원</span>
                        <span>상태</span>
                    </div>

                    <div className="rally-table-body">
                        {filteredRallies.map((rally) => (
                            <article className="rally-row" key={rally.id}>
                                <div className="rally-info-cell">
                                    <span className="rally-type-badge">{rally.type}</span>
                                    <h2>{rally.title}</h2>
                                </div>

                                <div className="rally-period-cell">
                                    <p>
                                        <Icon name="dots" />
                                        <span>접수: <strong>{rally.registrationPeriod}</strong></span>
                                    </p>
                                    <p>
                                        <Icon name="calendar" />
                                        <span>진행: <strong>{rally.progressPeriod}</strong></span>
                                    </p>
                                </div>

                                <div className="rally-participants-cell">
                                    <span className="rally-count-chip">{rally.participants}</span>
                                    <strong>{rally.participants}</strong>
                                    <span>/ {rally.capacity}</span>
                                </div>

                                <div className="rally-status-cell">
                                    <span className={`rally-status-badge ${rally.statusKey}`}>
                                        {rally.status}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <footer className="rally-list-footer">
                    <p>총 12개의 대회 중 4개 표시됨</p>

                    <div className="rally-pagination" aria-label="대회 목록 페이지">
                        <button type="button" aria-label="이전 페이지">
                            <Icon name="chevronLeft" />
                        </button>
                        <button className="active" type="button">1</button>
                        <button type="button">2</button>
                        <button type="button">3</button>
                        <button type="button" aria-label="다음 페이지">
                            <Icon name="chevronRight" />
                        </button>
                    </div>
                </footer>
            </section>
        </main>
    );
}

export default RallyListPage;
