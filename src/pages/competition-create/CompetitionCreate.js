import { useState } from "react";
import "./CompetitionCreate.css";

function CompetitionCreate() {
    const [form, setForm] = useState({
        title: "",
        type: "league",
        maxParticipants: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [error, setError] = useState("");

    const updateField = (field, value) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            setError("대회 이름을 입력해주세요.");
            return;
        }

        if (!form.maxParticipants || Number(form.maxParticipants) < 1) {
            setError("최대 인원수를 1명 이상으로 입력해주세요.");
            return;
        }

        if (!form.startDate || !form.endDate) {
            setError("시작 일자와 종료 일자를 모두 선택해주세요.");
            return;
        }

        if (form.endDate < form.startDate) {
            setError("종료 일자는 시작 일자보다 빠를 수 없습니다.");
            return;
        }

        setError("");
        console.log(form);
    };

    return (
        <main className="competition-create-page">
            <section className="competition-create-shell" aria-labelledby="competition-create-title">
                <header className="competition-create-header">
                    <h1 id="competition-create-title">대회 생성</h1>
                    <p>새로운 대회를 개최하고 규칙을 설정하세요.</p>
                </header>

                <form className="competition-create-form" onSubmit={handleSubmit}>
                    <div className="competition-create-card">
                        <label className="competition-field competition-field--full" htmlFor="competitionTitle">
                            <span>대회 타이틀</span>
                            <input
                                id="competitionTitle"
                                type="text"
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                placeholder="대회 이름을 입력하세요"
                            />
                        </label>

                        <fieldset className="competition-field competition-type-field">
                            <legend>대회 타입</legend>
                            <div className="competition-type-toggle" role="radiogroup" aria-label="대회 타입">
                                <button
                                    type="button"
                                    className={form.type === "league" ? "active" : ""}
                                    onClick={() => updateField("type", "league")}
                                    aria-pressed={form.type === "league"}
                                >
                                    리그 (League)
                                </button>
                                <button
                                    type="button"
                                    className={form.type === "tournament" ? "active" : ""}
                                    onClick={() => updateField("type", "tournament")}
                                    aria-pressed={form.type === "tournament"}
                                >
                                    토너먼트 (Tournament)
                                </button>
                            </div>
                        </fieldset>

                        <label className="competition-field" htmlFor="maxParticipants">
                            <span>최대 인원수</span>
                            <input
                                id="maxParticipants"
                                type="number"
                                min="1"
                                value={form.maxParticipants}
                                onChange={(event) => updateField("maxParticipants", event.target.value)}
                                placeholder="예: 32"
                            />
                        </label>

                        <label className="competition-field" htmlFor="startDate">
                            <span>시작 일자</span>
                            <input
                                id="startDate"
                                type="date"
                                value={form.startDate}
                                onChange={(event) => updateField("startDate", event.target.value)}
                            />
                        </label>

                        <label className="competition-field" htmlFor="endDate">
                            <span>종료 일자</span>
                            <input
                                id="endDate"
                                type="date"
                                value={form.endDate}
                                onChange={(event) => updateField("endDate", event.target.value)}
                            />
                        </label>

                        <label className="competition-field competition-field--full" htmlFor="competitionDescription">
                            <span>설명</span>
                            <textarea
                                id="competitionDescription"
                                value={form.description}
                                onChange={(event) => updateField("description", event.target.value)}
                                placeholder="대회 진행 방식, 규칙 등을 상세히 입력해주세요."
                            />
                        </label>

                        {error && <p className="competition-create-error">{error}</p>}
                    </div>

                    <div className="competition-create-actions">
                        <button type="button" className="competition-cancel-button">
                            취소
                        </button>
                        <button type="submit" className="competition-submit-button">
                            대회 생성하기
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default CompetitionCreate;
