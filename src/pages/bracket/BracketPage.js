import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getCompetitionById,
    getCompetitionStatusInfo,
    getSelectedCompetition,
    saveCompetitionBracketState,
    setSelectedCompetitionId,
} from "../../utils/localData";
import "./BracketPage.css";

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

function makeLeagueRounds(participants) {
    const byeParticipant = {
        id: "league-bye",
        team: "부전승",
        name: "휴식",
        isPlaceholder: true,
    };
    const players = participants.length % 2 === 0
        ? [...participants]
        : [...participants, byeParticipant];
    const rounds = [];

    if (players.length < 2) {
        return rounds;
    }

    let rotation = [...players];

    for (let roundIndex = 0; roundIndex < rotation.length - 1; roundIndex++) {
        const matches = [];

        for (let pairIndex = 0; pairIndex < rotation.length / 2; pairIndex++) {
            const home = rotation[pairIndex];
            const away = rotation[rotation.length - 1 - pairIndex];

            if (home.id === byeParticipant.id || away.id === byeParticipant.id) {
                continue;
            }

            matches.push({
                id: `league-round-${roundIndex + 1}-match-${pairIndex + 1}`,
                home,
                away,
            });
        }

        rounds.push({
            id: `league-round-${roundIndex + 1}`,
            label: `${roundIndex + 1}라운드`,
            matches,
        });

        const fixedPlayer = rotation[0];
        const rotatingPlayers = rotation.slice(1);
        const lastPlayer = rotatingPlayers.pop();

        rotation = [
            fixedPlayer,
            lastPlayer,
            ...rotatingPlayers,
        ];
    }

    return rounds;
}

function makeTournamentBracket(participants) {
    if (participants.length < 2) {
        return {
            firstRoundName: "",
            leftFirstRound: [],
            rightFirstRound: [],
            leftSide: [],
            rightSide: [],
        };
    }

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
    const { competitionId } = useParams();
    const competition = useMemo(
        () => getCompetitionById(competitionId) || getSelectedCompetition(),
        [competitionId]
    );
    const competitionParticipants = useMemo(() => (
        Array.isArray(competition?.participants) ? competition.participants : []
    ), [competition]);
    const savedParticipants = useMemo(() => {
        if (Array.isArray(competition?.bracketParticipants) && competition.bracketParticipants.length > 0) {
            return competition.bracketParticipants;
        }

        return competitionParticipants;
    }, [competition, competitionParticipants]);
    const savedWinners = useMemo(() => (
        competition?.bracketWinners && typeof competition.bracketWinners === "object"
            ? competition.bracketWinners
            : {}
    ), [competition]);
    const hasEnoughParticipants = competitionParticipants.length >= 4;
    const competitionStatus = competition
        ? getCompetitionStatusInfo(competition.startDate, competition.endDate)
        : { label: "샘플 데이터" };
    const [matchType, setMatchType] = useState(competition?.savedMatchType || competition?.type || "league");
    const [participants, setParticipants] = useState(savedParticipants);
    const [winners, setWinners] = useState(savedWinners);
    const [isMatchTypeLocked, setIsMatchTypeLocked] = useState(Boolean(competition?.isMatchTypeLocked));

    useEffect(() => {
        if (competition?.id) {
            setSelectedCompetitionId(competition.id);
        }

        setMatchType(competition?.savedMatchType || competition?.type || "league");
        setParticipants(savedParticipants);
        setWinners(savedWinners);
        setIsMatchTypeLocked(Boolean(competition?.isMatchTypeLocked));
    }, [competition, savedParticipants, savedWinners]);

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

    const saveBracketState = (
        nextParticipants,
        nextWinners,
        nextMatchType = matchType,
        nextIsMatchTypeLocked = isMatchTypeLocked
    ) => {
        if (!competition?.id) {
            return;
        }

        saveCompetitionBracketState(competition.id, {
            participants: nextParticipants,
            winners: nextWinners,
            matchType: nextMatchType,
            isMatchTypeLocked: nextIsMatchTypeLocked,
        });
    };

    const handleMatchTypeChange = (nextMatchType) => {
        if (isMatchTypeLocked) {
            return;
        }

        setMatchType(nextMatchType);
        setWinners({});
        setIsMatchTypeLocked(true);
        saveBracketState(participants, {}, nextMatchType, true);
    };

    const handleWinnersChange = (nextWinnersOrUpdater) => {
        setWinners((currentWinners) => {
            const nextWinners = typeof nextWinnersOrUpdater === "function"
                ? nextWinnersOrUpdater(currentWinners)
                : nextWinnersOrUpdater;

            saveBracketState(participants, nextWinners, matchType, isMatchTypeLocked);

            return nextWinners;
        });
    };

    const onShuffle = () => {
        const shuffledParticipants = shuffleParticipants(participants);

        setParticipants(shuffledParticipants);
        setWinners({});
        saveBracketState(shuffledParticipants, {}, matchType, isMatchTypeLocked);
    };

    return (
        <main className="bracket-page">
            <section className="bracket-hero">
                <p className="eyebrow">배민</p>
                <h1>{competition ? `${competition.title} 대진표` : "대진표 생성"}</h1>
                <p>
                    {competition?.description || "참가 신청이 끝난 뒤 참가자 리스트를 랜덤으로 섞어서 리그전 또는 토너먼트 대진표로 보여주는 페이지입니다."}
                </p>
            </section>

            <section className="bracket-panel">
                <div className="panel-header">
                    <div className="panel-header-copy">
                        <p className="eyebrow">대회</p>
                        <h2>{competition?.title || "웹프로그래밍 수행평가 대회"}</h2>
                        <p>{competition ? "대회 목록에서 선택한 데이터를 그대로 불러왔습니다." : "선택된 대회가 없어서 기본 샘플 데이터를 보여주고 있습니다."}</p>
                    </div>

                    <div className="control-group">
                        <Link className="panel-route-link" to="/competitions">
                            대회 목록 보기
                        </Link>
                        <button
                            className={matchType === "league" ? "mode-button active" : "mode-button"}
                            onClick={() => handleMatchTypeChange("league")}
                            disabled={isMatchTypeLocked}
                            title={isMatchTypeLocked ? "진행 방식이 이미 확정되었습니다." : "리그전으로 확정"}
                            type="button"
                        >
                            리그
                        </button>
                        <button
                            className={matchType === "tournament" ? "mode-button active" : "mode-button"}
                            onClick={() => handleMatchTypeChange("tournament")}
                            disabled={isMatchTypeLocked}
                            title={isMatchTypeLocked ? "진행 방식이 이미 확정되었습니다." : "토너먼트로 확정"}
                            type="button"
                        >
                            토너먼트
                        </button>
                        {isMatchTypeLocked && (
                            <span className="mode-lock-hint">진행 방식 확정됨</span>
                        )}
                        {hasEnoughParticipants && (
                            <button className="shuffle-button" onClick={onShuffle} type="button">
                                랜덤 섞기
                            </button>
                        )}
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
                        <span>대회 상태</span>
                        <strong>{competitionStatus.label}</strong>
                    </div>
                </div>

                {!hasEnoughParticipants ? (
                    <section className="bracket-empty-state">
                        <h3>아직 대진표를 만들 수 없습니다.</h3>
                        <p>
                            현재 신청 인원은 <strong>{participants.length}명</strong>입니다.
                            대진표를 만들려면 최소 4명 이상 신청해야 합니다.
                        </p>
                    </section>
                ) : matchType === "league" ? (
                    <LeagueTable participants={participants} />
                ) : (
                    <TournamentBracket bracket={tournamentBracket} winners={tournamentWinners} setWinners={handleWinnersChange} />
                )}
            </section>
        </main>
    );
}

function LeagueTable({ participants }) {
    const leagueRounds = useMemo(() => makeLeagueRounds(participants), [participants]);
    const [activeRoundIndex, setActiveRoundIndex] = useState(0);

    useEffect(() => {
        setActiveRoundIndex(0);
    }, [leagueRounds.length]);

    if (participants.length > 8) {
        const activeRound = leagueRounds[activeRoundIndex] || null;

        return (
            <section className="league-card">
                <div className="league-schedule-header">
                    <div className="section-title">
                        <p className="eyebrow">리그</p>
                        <h3>리그전 일정표</h3>
                    </div>

                    <div className="league-schedule-summary">
                        <span>참가자 {participants.length}명</span>
                        <strong>총 {leagueRounds.length}라운드</strong>
                    </div>
                </div>

                <div className="league-schedule-toolbar">
                    <button
                        type="button"
                        className="league-round-button"
                        onClick={() => setActiveRoundIndex((currentIndex) => Math.max(currentIndex - 1, 0))}
                        disabled={activeRoundIndex === 0}
                    >
                        이전 라운드
                    </button>
                    <strong>{activeRound?.label || "라운드 준비 중"}</strong>
                    <button
                        type="button"
                        className="league-round-button"
                        onClick={() => setActiveRoundIndex((currentIndex) => Math.min(currentIndex + 1, leagueRounds.length - 1))}
                        disabled={activeRoundIndex === leagueRounds.length - 1}
                    >
                        다음 라운드
                    </button>
                </div>

                <div className="league-round-list">
                    {activeRound?.matches.map((match, index) => (
                        <article className="league-round-card" key={match.id}>
                            <span className="league-round-card__index">{index + 1}경기</span>
                            <div className="league-round-card__teams">
                                <ParticipantCard participant={match.home} />
                                <span className="league-round-card__vs">대</span>
                                <ParticipantCard participant={match.away} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="league-card">
            <div className="section-title">
                <p className="eyebrow">리그</p>
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
                                {rowIndex === columnIndex ? "" : "대"}
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
                <p className="eyebrow">토너먼트</p>
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
