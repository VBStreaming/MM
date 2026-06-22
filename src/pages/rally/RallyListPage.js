import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    applyToCompetition,
    formatDateLabel,
    getCurrentUser,
    getCompetitions,
    getCompetitionStatusInfo,
    hasAppliedToCompetition,
    setSelectedCompetitionId,
} from "../../utils/localData";
import "./RallyListPage.css";

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

function getTypeLabel(type) {
    return type === "tournament" ? "TOURNAMENT" : "LEAGUE";
}

function RallyListPage() {
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("all");
    const [competitions, setCompetitions] = useState(() => getCompetitions());
    const currentUser = getCurrentUser();
    const rallies = competitions.map((competition) => {
        const status = getCompetitionStatusInfo(competition.startDate, competition.endDate);
        const alreadyApplied = hasAppliedToCompetition(competition, currentUser);

        return {
            ...competition,
            typeLabel: getTypeLabel(competition.type),
            currentParticipants: competition.participants.length,
            registrationPeriod: `${formatDateLabel(competition.createdAt.slice(0, 10))} - ${formatDateLabel(competition.startDate)}`,
            progressPeriod: `${formatDateLabel(competition.startDate)} - ${formatDateLabel(competition.endDate)}`,
            statusKey: status.statusKey,
            status: status.label,
            alreadyApplied,
        };
    });
    const filteredRallies = activeTab === "all"
        ? rallies
        : rallies.filter((rally) => rally.statusKey === activeTab);

    const handleApply = (competitionId) => {
        const applyResult = applyToCompetition(competitionId, currentUser);

        if (!applyResult.success && applyResult.reason === "auth_required") {
            history.push("/login", { redirectTo: "/competitions" });
            return;
        }

        setCompetitions(getCompetitions());
    };

    return (
        <main className="rally-list-page">
            <section className="rally-list-shell" aria-labelledby="rally-list-title">
                <header className="rally-list-header">
                    <div>
                        <h1 id="rally-list-title">대회 목록</h1>
                        <p>로컬스토리지에 저장된 대회를 한눈에 확인하고 바로 대진표로 이동할 수 있습니다.</p>
                    </div>

                    <div className="rally-header-actions">
                        <Link className="rally-manage-button" to="/mypage">
                            마이페이지
                        </Link>
                        <Link className="rally-create-button" to="/competitions/new">
                            <Icon name="plus" />
                            <span>대회 생성하기</span>
                        </Link>
                    </div>
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
                        {filteredRallies.length === 0 && (
                            <div className="rally-empty-state">
                                <h2>조건에 맞는 대회가 없습니다.</h2>
                                <p>필터를 바꾸거나 새 대회를 생성해보세요.</p>
                            </div>
                        )}

                        {filteredRallies.map((rally) => (
                            (() => {
                                const isFull = rally.currentParticipants >= rally.maxParticipants;
                                const canApply = rally.statusKey === "recruiting" && !isFull && !rally.alreadyApplied;
                                const applyLabel = rally.alreadyApplied
                                    ? "신청 완료"
                                    : isFull
                                    ? "정원 마감"
                                    : rally.statusKey === "recruiting"
                                        ? "신청하기"
                                        : "신청 마감";

                                return (
                                    <article className="rally-row" key={rally.id}>
                                        <div className="rally-info-cell">
                                            <span className="rally-type-badge">{rally.typeLabel}</span>
                                            <div className="rally-info-copy">
                                                <h2>{rally.title}</h2>
                                                <p>{rally.description || "설명이 아직 등록되지 않았습니다."}</p>
                                            </div>
                                        </div>

                                        <div className="rally-period-cell">
                                            <p>
                                                <Icon name="dots" />
                                                <span>생성~접수: <strong>{rally.registrationPeriod}</strong></span>
                                            </p>
                                            <p>
                                                <Icon name="calendar" />
                                                <span>진행: <strong>{rally.progressPeriod}</strong></span>
                                            </p>
                                        </div>

                                        <div className="rally-participants-cell">
                                            <span className="rally-count-chip">{rally.currentParticipants}</span>
                                            <strong>{rally.currentParticipants}</strong>
                                            <span>/ {rally.maxParticipants}</span>
                                        </div>

                                        <div className="rally-status-cell">
                                            <span className={`rally-status-badge ${rally.statusKey}`}>
                                                {rally.status}
                                            </span>
                                            <div className="rally-action-group">
                                                <button
                                                    className={canApply ? "rally-apply-button" : "rally-apply-button is-disabled"}
                                                    type="button"
                                                    onClick={() => handleApply(rally.id)}
                                                    disabled={!canApply}
                                                >
                                                    {applyLabel}
                                                </button>
                                                <Link
                                                    className="rally-view-link"
                                                    to={`/bracket/${rally.id}`}
                                                    onClick={() => setSelectedCompetitionId(rally.id)}
                                                >
                                                    대진표 보기
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })()
                        ))}
                    </div>
                </section>

                <footer className="rally-list-footer">
                    <p>총 {rallies.length}개의 대회 중 {filteredRallies.length}개 표시됨</p>

                    <div className="rally-pagination" aria-label="대회 목록 페이지">
                        <button type="button" aria-label="이전 페이지" disabled>
                            <Icon name="chevronLeft" />
                        </button>
                        <button className="active" type="button">1</button>
                        <button type="button" aria-label="다음 페이지" disabled>
                            <Icon name="chevronRight" />
                        </button>
                    </div>
                </footer>
            </section>
        </main>
    );
}

export default RallyListPage;
