import { Fragment, useMemo, useState } from "react";
import "./BracketPage.css";

const dummyParticipants = [
    { id: 1, team: "중앙대", name: "김지수" },
    { id: 2, team: "단국대", name: "박민준" },
    { id: 3, team: "수성대", name: "이서연" },
    { id: 4, team: "전남과학대", name: "최도윤" },
    { id: 5, team: "동아대", name: "정하은" },
    { id: 6, team: "홍익대", name: "강현우" },
    { id: 7, team: "경기대", name: "윤지호" },
    { id: 8, team: "건양대", name: "한유진" },
    { id: 9, team: "아산", name: "이기준" },
    { id: 10, team: "아산", name: "조성민" },
    { id: 11, team: "하현", name: "김선민" },
    { id: 12, team: "하현", name: "임재범" },
    { id: 13, team: "목사랑", name: "권오완" },
    { id: 14, team: "목사랑", name: "강현진" },
    { id: 15, team: "천도", name: "차재민" },
    { id: 16, team: "천도", name: "이민구" },
];

function shuffleParticipants(participants) {
    const result = [...participants];

    for (let i = result.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = result[i];
        result[i] = result[randomIndex];
        result[randomIndex] = temp;
    }

    return result;
}

function getBracketSize(count) {
    let size = 1;

    while (size < count) {
        size *= 2;
    }

    return size;
}

function getRoundName(matchCount) {
    if (matchCount === 1) {
        return "결승";
    }

    if (matchCount === 2) {
        return "4강";
    }

    return `${matchCount * 2}강`;
}

function makeTournamentBracket(participants) {
    const bracketSize = getBracketSize(participants.length);
    const seededParticipants = [...participants];

    while (seededParticipants.length < bracketSize) {
        seededParticipants.push({ id: `bye-${seededParticipants.length}`, team: "부전승", name: "다음 라운드" });
    }

    const firstRoundMatches = [];

    for (let i = 0; i < seededParticipants.length; i += 2) {
        firstRoundMatches.push({
            id: `round-1-match-${i / 2 + 1}`,
            home: seededParticipants[i],
            away: seededParticipants[i + 1],
        });
    }

    const halfIndex = firstRoundMatches.length / 2;
    const leftFirstRound = firstRoundMatches.slice(0, halfIndex);
    const rightFirstRound = firstRoundMatches.slice(halfIndex);
    const leftSide = makeSideRounds("left", leftFirstRound, 1);
    const rightSide = makeSideRounds("right", rightFirstRound, halfIndex + 1);

    return {
        firstRoundName: getRoundName(firstRoundMatches.length),
        leftFirstRound,
        rightFirstRound,
        leftSide,
        rightSide,
    };
}

function makeSideRounds(side, firstRoundMatches, startNumber) {
    const rounds = [
        {
            name: getRoundName(firstRoundMatches.length * 2),
            matches: firstRoundMatches,
        },
    ];
    let previousMatches = firstRoundMatches;
    let roundIndex = 2;

    while (previousMatches.length > 1) {
        const nextMatches = [];

        for (let i = 0; i < previousMatches.length; i += 2) {
            nextMatches.push({
                id: `${side}-round-${roundIndex}-match-${i / 2 + 1}`,
                home: makePlaceholder(`${startNumber + i}경기`),
                away: makePlaceholder(`${startNumber + i + 1}경기`),
                sourceMatchIds: [previousMatches[i].id, previousMatches[i + 1].id],
            });
        }

        rounds.push({
            name: getRoundName(nextMatches.length * 2),
            matches: nextMatches,
        });

        previousMatches = nextMatches;
        roundIndex += 1;
    }

    return rounds;
}

function makePlaceholder(team) {
    return { id: `placeholder-${team}`, team, name: "승자", isPlaceholder: true };
}

function ParticipantCard({ participant, className = "", isSelected = false, onClick }) {
    const canClick = Boolean(onClick) && !participant.isPlaceholder;

    return (
        <div
            className={`participant-card ${participant.team === "부전승" ? "is-bye" : ""} ${isSelected ? "is-selected" : ""} ${canClick ? "is-clickable" : ""} ${className}`}
            onClick={canClick ? onClick : undefined}
            role={canClick ? "button" : undefined}
            tabIndex={canClick ? 0 : undefined}
        >
            <span>{participant.team}</span>
            <strong>{participant.name}</strong>
        </div>
    );
}

function BracketPage() {
    const [matchType, setMatchType] = useState("league");
    const [participantCount, setParticipantCount] = useState(15);
    const [participants, setParticipants] = useState(dummyParticipants.slice(0, participantCount));
    const [winners, setWinners] = useState({});

    const tournamentBracket = useMemo(() => makeTournamentBracket(participants), [participants]);
    const automaticByeWinners = useMemo(() => {
        const byeWinners = {};
        const firstRoundMatches = [
            ...tournamentBracket.leftFirstRound,
            ...tournamentBracket.rightFirstRound,
        ];

        firstRoundMatches.forEach((match) => {
            if (match.home.team === "부전승") {
                byeWinners[match.id] = match.away;
            }

            if (match.away.team === "부전승") {
                byeWinners[match.id] = match.home;
            }
        });

        return byeWinners;
    }, [tournamentBracket]);
    const tournamentWinners = { ...automaticByeWinners, ...winners };

    const onShuffle = () => {
        setParticipants(shuffleParticipants(participants));
        setWinners({});
    };

    const onChangeParticipantCount = (e) => {
        const nextCount = Number(e.target.value);

        setParticipantCount(nextCount);
        setParticipants(dummyParticipants.slice(0, nextCount));
        setWinners({});
    };

    return (
        <main className="bracket-page">
            <section className="bracket-hero">
                <p className="eyebrow">BracketMaster</p>
                <h1>대진표 생성</h1>
                <p>
                    참가 신청이 끝난 뒤 참가자 리스트를 랜덤으로 섞어서 리그전 또는 토너먼트
                    대진표로 보여주는 페이지입니다.
                </p>
            </section>

            <section className="bracket-panel">
                <div className="panel-header">
                    <div>
                        <p className="eyebrow">Tournament</p>
                        <h2>웹프로그래밍 수행평가 대회</h2>
                    </div>

                    <div className="control-group">
                        <label className="count-control">
                            참가 인원
                            <input
                                max={dummyParticipants.length}
                                min="4"
                                onChange={onChangeParticipantCount}
                                type="number"
                                value={participantCount}
                            />
                        </label>
                        <button
                            className={matchType === "league" ? "mode-button active" : "mode-button"}
                            onClick={() => setMatchType("league")}
                            type="button"
                        >
                            리그
                        </button>
                        <button
                            className={matchType === "tournament" ? "mode-button active" : "mode-button"}
                            onClick={() => setMatchType("tournament")}
                            type="button"
                        >
                            토너먼트
                        </button>
                        <button className="shuffle-button" onClick={onShuffle} type="button">
                            랜덤 섞기
                        </button>
                    </div>
                </div>

                <div className="summary-grid">
                    <div>
                        <span>참가 인원</span>
                        <strong>{participants.length}명</strong>
                    </div>
                    <div>
                        <span>진행 방식</span>
                        <strong>{matchType === "league" ? "리그전" : "토너먼트"}</strong>
                    </div>
                    <div>
                        <span>현재 데이터</span>
                        <strong>더미 참가자</strong>
                    </div>
                </div>

                {matchType === "league" ? (
                    <LeagueTable participants={participants} />
                ) : (
                    <TournamentBracket bracket={tournamentBracket} winners={tournamentWinners} setWinners={setWinners} />
                )}
            </section>
        </main>
    );
}

function LeagueTable({ participants }) {
    return (
        <section className="league-card">
            <div className="section-title">
                <p className="eyebrow">League</p>
                <h3>리그전 대진표</h3>
            </div>

            <div
                className="league-table"
                style={{ gridTemplateColumns: `repeat(${participants.length + 1}, minmax(112px, 1fr))` }}
            >
                <div className="league-cell table-corner">참가자</div>
                {participants.map((participant) => (
                    <div className="league-cell table-head" key={`head-${participant.id}`}>
                        <span>{participant.team}</span>
                        <strong>{participant.name}</strong>
                    </div>
                ))}

                {participants.map((rowParticipant, rowIndex) => (
                    <Fragment key={`league-row-${rowParticipant.id}`}>
                        <div className="league-cell table-head row-head" key={`row-${rowParticipant.id}`}>
                            <span>{rowParticipant.team}</span>
                            <strong>{rowParticipant.name}</strong>
                        </div>

                        {participants.map((columnParticipant, columnIndex) => (
                            <div
                                className={
                                    rowIndex === columnIndex
                                        ? "league-cell match-cell disabled"
                                        : "league-cell match-cell"
                                }
                                key={`${rowParticipant.id}-${columnParticipant.id}`}
                            >
                                {rowIndex === columnIndex ? "" : "VS"}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </section>
    );
}

function MatchPair({ match, matchNumber, selectedWinner, onSelect }) {
    return (
        <div className="match-pair">
            <div className="match-number">{matchNumber}</div>
            <ParticipantCard
                participant={match.home}
                isSelected={selectedWinner && selectedWinner.id === match.home.id}
                onClick={() => onSelect(match.id, match.home)}
            />
            <ParticipantCard
                participant={match.away}
                isSelected={selectedWinner && selectedWinner.id === match.away.id}
                onClick={() => onSelect(match.id, match.away)}
            />
        </div>
    );
}

function TournamentSide({ rounds, finalist, direction, winners, onSelectWinner, columnStart, finalistColumn }) {
    return (
        <div className={`tournament-side ${direction}`}>
            {rounds.map((round, roundIndex) => {
                const column = direction === "left"
                    ? columnStart + roundIndex
                    : columnStart + rounds.length - roundIndex;

                return (
                    <div
                        className={`side-column side-round round-depth-${roundIndex} ${roundIndex === 0 ? "first-round" : ""} ${roundIndex === rounds.length - 1 ? "side-final" : ""}`}
                        key={`${direction}-${round.name}`}
                        style={{ gridColumn: column }}
                    >
                        <h4>{round.name}</h4>
                        <div className="match-list">
                            {round.matches.map((match, index) => (
                                <MatchPair
                                    key={match.id}
                                    match={match}
                                    matchNumber={`${index + 1}경기`}
                                    selectedWinner={winners[match.id]}
                                    onSelect={onSelectWinner}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            <div className="side-column finalist-round" style={{ gridColumn: finalistColumn }}>
                <h4>결승 진출</h4>
                <ParticipantCard participant={finalist} className="finalist-card" />
            </div>
        </div>
    );
}

function getRoundMatchesWithWinners(rounds, winners) {
    return rounds.map((round, roundIndex) => {
        if (roundIndex === 0) {
            return round;
        }

        return {
            ...round,
            matches: round.matches.map((match) => ({
                ...match,
                home: winners[match.sourceMatchIds[0]] || match.home,
                away: winners[match.sourceMatchIds[1]] || match.away,
            })),
        };
    });
}

function getDependentMatchIds(matchId, rounds) {
    const dependentIds = [];
    let changed = true;

    while (changed) {
        changed = false;

        for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
            const round = rounds[roundIndex];

            for (let matchIndex = 0; matchIndex < round.matches.length; matchIndex++) {
                const match = round.matches[matchIndex];
                const sourceIds = match.sourceMatchIds || [];
                const dependsOnSelected = sourceIds.includes(matchId)
                    || sourceIds.some((sourceId) => dependentIds.includes(sourceId));

                if (dependsOnSelected && !dependentIds.includes(match.id)) {
                    dependentIds.push(match.id);
                    changed = true;
                }
            }
        }
    }

    return dependentIds;
}

function TournamentBracket({ bracket, winners, setWinners }) {
    const leftRounds = getRoundMatchesWithWinners(bracket.leftSide, winners);
    const rightRounds = getRoundMatchesWithWinners(bracket.rightSide, winners);
    const sideColumnCount = leftRounds.length + 1;
    const centerColumn = sideColumnCount + 1;
    const rightColumnStart = centerColumn + 1;
    const firstRoundCount = Math.max(bracket.leftFirstRound.length, bracket.rightFirstRound.length);
    const compactSize = firstRoundCount > 2 ? "small" : "large";
    const boardStyle = {
        "--match-height": compactSize === "small" ? "112px" : "142px",
        "--player-height": compactSize === "small" ? "48px" : "62px",
        "--match-gap": compactSize === "small" ? "22px" : "48px",
        "--board-height": compactSize === "small" ? "620px" : "560px",
        "--card-font": compactSize === "small" ? "13px" : "16px",
        gridTemplateColumns: `repeat(${sideColumnCount}, minmax(100px, 1fr)) minmax(150px, 1.1fr) repeat(${sideColumnCount}, minmax(100px, 1fr))`,
        minWidth: compactSize === "small" ? "1120px" : "900px",
    };
    const leftFinalMatchId = leftRounds[leftRounds.length - 1].matches[0].id;
    const rightFinalMatchId = rightRounds[rightRounds.length - 1].matches[0].id;
    const leftFinalist = winners[leftFinalMatchId] || makePlaceholder("왼쪽 4강");
    const rightFinalist = winners[rightFinalMatchId] || makePlaceholder("오른쪽 4강");
    const finalMatch = {
        id: "final",
        home: leftFinalist,
        away: rightFinalist,
    };
    const winner = winners.final || { id: "winner-placeholder", team: "최종 우승", name: "우승자", isPlaceholder: true };

    const onSelectWinner = (matchId, participant) => {
        if (participant.isPlaceholder) {
            return;
        }

        setWinners((prevWinners) => {
            const allRounds = [...bracket.leftSide, ...bracket.rightSide];
            const dependentIds = getDependentMatchIds(matchId, allRounds);
            const nextWinners = {
                ...prevWinners,
                [matchId]: participant,
            };

            dependentIds.forEach((dependentId) => {
                delete nextWinners[dependentId];
            });

            if (matchId !== "final") {
                delete nextWinners.final;
            }

            return nextWinners;
        });
    };

    return (
        <section className="tournament-card">
            <div className="section-title">
                <p className="eyebrow">Tournament</p>
                <h3>토너먼트 대진표</h3>
            </div>

            <div
                className={`tournament-board split-board ${compactSize === "small" ? "many-rounds" : ""}`}
                style={boardStyle}
            >
                <TournamentSide
                    rounds={leftRounds}
                    finalist={leftFinalist}
                    direction="left"
                    winners={winners}
                    onSelectWinner={onSelectWinner}
                    columnStart={1}
                    finalistColumn={sideColumnCount}
                />

                <div className="final-column" style={{ gridColumn: centerColumn }}>
                    <h4>우승자</h4>
                    {winners.final && <img className="trophy-image" src="/trophy.png" alt="우승 트로피" />}
                    <ParticipantCard
                        participant={winner}
                        className="winner-card"
                        isSelected={Boolean(winners.final)}
                    />
                    <div className="center-final-line"></div>
                    <h4 className="final-title">결승</h4>
                    <div className="final-match">
                        <ParticipantCard
                            participant={finalMatch.home}
                            isSelected={winners.final && winners.final.id === finalMatch.home.id}
                            onClick={() => onSelectWinner(finalMatch.id, finalMatch.home)}
                        />
                        <ParticipantCard
                            participant={finalMatch.away}
                            isSelected={winners.final && winners.final.id === finalMatch.away.id}
                            onClick={() => onSelectWinner(finalMatch.id, finalMatch.away)}
                        />
                    </div>
                </div>

                <TournamentSide
                    rounds={rightRounds}
                    finalist={rightFinalist}
                    direction="right"
                    winners={winners}
                    onSelectWinner={onSelectWinner}
                    columnStart={rightColumnStart}
                    finalistColumn={rightColumnStart}
                />
            </div>
        </section>
    );
}

export default BracketPage;
