const STORAGE_KEYS = {
    competitions: "baemin-competitions",
    profile: "baemin-profile",
    users: "baemin-users",
    currentUser: "baemin-current-user",
    selectedCompetitionId: "baemin-selected-competition-id",
};

const DEFAULT_PROFILE = {
    name: "현승민",
    studentId: "2412",
    phone: "010-1234-5678",
    gender: "여성",
    role: "대회 관리자",
};

const DEMO_USERS = [
    {
        id: "user-demo",
        name: "데모 사용자",
        studentId: "20260000",
        email: "demo@demo.com",
        password: "1234",
        phone: "010-0000-0000",
        gender: "미설정",
        role: "참가자",
        createdAt: "2026-06-22T09:00:00.000Z",
    },
    {
        id: "user-demo-2",
        name: "김민수",
        studentId: "20260001",
        email: "minsu@demo.com",
        password: "1234",
        phone: "010-1111-1111",
        gender: "남성",
        role: "참가자",
        createdAt: "2026-06-22T09:05:00.000Z",
    },
    {
        id: "user-demo-3",
        name: "박서연",
        studentId: "20260002",
        email: "seoyeon@demo.com",
        password: "1234",
        phone: "010-2222-2222",
        gender: "여성",
        role: "참가자",
        createdAt: "2026-06-22T09:10:00.000Z",
    },
    {
        id: "user-demo-4",
        name: "이도윤",
        studentId: "20260003",
        email: "doyun@demo.com",
        password: "1234",
        phone: "010-3333-3333",
        gender: "남성",
        role: "참가자",
        createdAt: "2026-06-22T09:15:00.000Z",
    },
];

const TEAM_PREFIXES = [
    "푸른",
    "붉은",
    "초록",
    "하얀",
    "검은",
    "금빛",
    "은빛",
    "주황",
    "보라",
    "진홍",
    "하늘",
    "바다",
    "빠른",
    "꿈",
    "새별",
    "정상",
];

const TEAM_SUFFIXES = [
    "호랑이",
    "매",
    "폭풍",
    "늑대",
    "별",
    "돌격대",
    "맥박",
    "불사조",
];

const PLAYER_NAMES = [
    "김지수",
    "박민준",
    "이서연",
    "최도윤",
    "정하은",
    "강현우",
    "윤지호",
    "한유진",
    "이기준",
    "조성민",
    "김선민",
    "임재범",
    "권오완",
    "강현진",
    "차재민",
    "이민구",
];

function readJson(key) {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const value = window.localStorage.getItem(key);

        return value ? JSON.parse(value) : null;
    } catch (error) {
        return null;
    }
}

function writeJson(key, value) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageValue(key) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(key);
}

function toNumber(value, fallback) {
    const nextValue = Number(value);

    return Number.isFinite(nextValue) ? nextValue : fallback;
}

function formatTeamName(index) {
    const prefix = TEAM_PREFIXES[index % TEAM_PREFIXES.length];
    const suffix = TEAM_SUFFIXES[index % TEAM_SUFFIXES.length];

    return `${prefix} ${suffix}`;
}

export function buildParticipant(index) {
    return {
        id: `participant-${index + 1}`,
        team: formatTeamName(index),
        name: PLAYER_NAMES[index % PLAYER_NAMES.length],
    };
}

export function buildParticipants(count) {
    const safeCount = Math.max(4, toNumber(count, 4));

    return Array.from({ length: safeCount }, (_, index) => buildParticipant(index));
}

function normalizeParticipant(rawParticipant, index = 0) {
    return {
        id: rawParticipant?.id || `participant-${index + 1}`,
        userId: rawParticipant?.userId || "",
        team: rawParticipant?.team || `참가팀 ${index + 1}`,
        name: rawParticipant?.name || `참가자 ${index + 1}`,
        isPlaceholder: Boolean(rawParticipant?.isPlaceholder),
    };
}

function hasSameParticipantSet(leftParticipants, rightParticipants) {
    if (leftParticipants.length !== rightParticipants.length) {
        return false;
    }

    const leftIds = leftParticipants.map((participant) => participant.id).sort();
    const rightIds = rightParticipants.map((participant) => participant.id).sort();

    return leftIds.every((participantId, index) => participantId === rightIds[index]);
}

function normalizeWinnerMap(rawWinners, participants) {
    if (!rawWinners || typeof rawWinners !== "object") {
        return {};
    }

    const participantMap = new Map(
        participants.map((participant) => [participant.id, participant])
    );
    const nextWinners = {};

    Object.entries(rawWinners).forEach(([matchId, rawWinner]) => {
        const matchedParticipant = participantMap.get(rawWinner?.id);

        if (!matchedParticipant) {
            return;
        }

        nextWinners[matchId] = matchedParticipant;
    });

    return nextWinners;
}

function isSameParticipant(leftParticipant, rightParticipant) {
    return leftParticipant?.id === rightParticipant?.id
        && leftParticipant?.team === rightParticipant?.team
        && leftParticipant?.name === rightParticipant?.name;
}

function isLegacyAutoFilledCompetition(rawCompetition, participants, safeCapacity) {
    if (rawCompetition?.isSeed || participants.length === 0) {
        return false;
    }

    const expectedParticipants = Array.from(
        { length: safeCapacity },
        (_, index) => buildParticipant(index)
    );

    if (participants.length !== expectedParticipants.length) {
        return false;
    }

    return participants.every((participant, index) =>
        isSameParticipant(participant, expectedParticipants[index])
    );
}

function normalizeCompetition(rawCompetition, index = 0) {
    const safeCapacity = Math.max(4, toNumber(rawCompetition?.maxParticipants, 4));
    const competitionType = rawCompetition?.type === "tournament" ? "tournament" : "league";
    const storedParticipants = Array.isArray(rawCompetition?.participants)
        ? rawCompetition.participants.filter(Boolean)
        : [];
    const participants = isLegacyAutoFilledCompetition(rawCompetition, storedParticipants, safeCapacity)
        ? []
        : storedParticipants.map((participant, participantIndex) =>
            normalizeParticipant(participant, participantIndex)
        );
    const storedBracketParticipants = Array.isArray(rawCompetition?.bracketParticipants)
        ? rawCompetition.bracketParticipants.filter(Boolean).map((participant, participantIndex) =>
            normalizeParticipant(participant, participantIndex)
        )
        : participants;
    const bracketParticipants = hasSameParticipantSet(participants, storedBracketParticipants)
        ? storedBracketParticipants
        : participants;
    const savedMatchType = competitionType;
    const bracketWinners = normalizeWinnerMap(rawCompetition?.bracketWinners, bracketParticipants);

    return {
        id: rawCompetition?.id || `competition-${index + 1}`,
        title: rawCompetition?.title || "새 대회",
        type: competitionType,
        maxParticipants: safeCapacity,
        startDate: rawCompetition?.startDate || "2026-07-01",
        endDate: rawCompetition?.endDate || "2026-07-03",
        description: rawCompetition?.description || "",
        createdAt: rawCompetition?.createdAt || new Date().toISOString(),
        createdById: rawCompetition?.createdById || "",
        createdByName: rawCompetition?.createdByName || "",
        participants,
        bracketParticipants,
        bracketWinners,
        savedMatchType,
        isMatchTypeLocked: true,
        isSeed: Boolean(rawCompetition?.isSeed),
    };
}

function createSeedCompetitions() {
    return [
        normalizeCompetition({
            id: "competition-seed-1",
            title: "2026 여름 리그",
            type: "league",
            maxParticipants: 8,
            startDate: "2026-06-25",
            endDate: "2026-07-10",
            description: "여름 시즌 교내 리그전입니다.",
            createdAt: "2026-06-10T09:00:00.000Z",
            participants: buildParticipants(8),
            isSeed: true,
        }),
        normalizeCompetition({
            id: "competition-seed-2",
            title: "교내 토너먼트 컵",
            type: "tournament",
            maxParticipants: 16,
            startDate: "2026-06-18",
            endDate: "2026-06-23",
            description: "학교별 대표전 토너먼트입니다.",
            createdAt: "2026-06-01T09:00:00.000Z",
            participants: buildParticipants(16),
            isSeed: true,
        }),
        normalizeCompetition({
            id: "competition-seed-3",
            title: "겨울 챔피언십",
            type: "tournament",
            maxParticipants: 8,
            startDate: "2026-05-12",
            endDate: "2026-05-15",
            description: "지난 시즌 결산 대회입니다.",
            createdAt: "2026-04-20T09:00:00.000Z",
            participants: buildParticipants(8),
            isSeed: true,
        }),
    ];
}

function ensureCompetitions() {
    const storedCompetitions = readJson(STORAGE_KEYS.competitions);

    if (!Array.isArray(storedCompetitions) || storedCompetitions.length === 0) {
        const seedCompetitions = createSeedCompetitions();
        writeJson(STORAGE_KEYS.competitions, seedCompetitions);

        return seedCompetitions;
    }

    const normalizedCompetitions = storedCompetitions.map((competition, index) =>
        normalizeCompetition(competition, index)
    );

    writeJson(STORAGE_KEYS.competitions, normalizedCompetitions);

    return normalizedCompetitions;
}

function ensureProfile() {
    const storedProfile = readJson(STORAGE_KEYS.profile);

    if (!storedProfile) {
        writeJson(STORAGE_KEYS.profile, DEFAULT_PROFILE);

        return DEFAULT_PROFILE;
    }

    const normalizedProfile = {
        ...DEFAULT_PROFILE,
        ...storedProfile,
    };

    writeJson(STORAGE_KEYS.profile, normalizedProfile);

    return normalizedProfile;
}

function normalizeUser(rawUser, index = 0) {
    return {
        id: rawUser?.id || `user-${index + 1}`,
        name: rawUser?.name || rawUser?.fullName || DEFAULT_PROFILE.name,
        studentId: rawUser?.studentId || "",
        email: rawUser?.email || "",
        password: rawUser?.password || "",
        phone: rawUser?.phone || "",
        gender: rawUser?.gender || "",
        role: rawUser?.role || "참가자",
        createdAt: rawUser?.createdAt || new Date().toISOString(),
    };
}

function createSeedUsers() {
    return DEMO_USERS.map((demoUser, index) => normalizeUser(demoUser, index));
}

function ensureUsers() {
    const storedUsers = readJson(STORAGE_KEYS.users);

    if (!Array.isArray(storedUsers) || storedUsers.length === 0) {
        const seedUsers = createSeedUsers();
        writeJson(STORAGE_KEYS.users, seedUsers);

        return seedUsers;
    }

    const normalizedUsers = storedUsers.map((user, index) => normalizeUser(user, index));
    const normalizedDemoUsers = createSeedUsers();
    const nextUsers = [...normalizedUsers];

    normalizedDemoUsers.forEach((demoUser) => {
        const hasDemoUser = nextUsers.some((user) => user.email.toLowerCase() === demoUser.email.toLowerCase());

        if (!hasDemoUser) {
            nextUsers.push(demoUser);
        }
    });

    writeJson(STORAGE_KEYS.users, nextUsers);

    return nextUsers;
}

function setCurrentUser(user) {
    if (!user) {
        removeStorageValue(STORAGE_KEYS.currentUser);
        return;
    }

    writeJson(STORAGE_KEYS.currentUser, user);
}

function compareByCreatedAt(a, b) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function getCompetitions() {
    return [...ensureCompetitions()].sort(compareByCreatedAt);
}

export function getCompetitionStatusInfo(startDate, endDate) {
    const today = new Date().toISOString().slice(0, 10);

    if (today < startDate) {
        return { statusKey: "recruiting", label: "접수 중" };
    }

    if (today > endDate) {
        return { statusKey: "ended", label: "종료" };
    }

    return { statusKey: "active", label: "진행 중" };
}

export function formatDateLabel(dateString) {
    if (!dateString) {
        return "-";
    }

    return dateString.replaceAll("-", ".");
}

export function getCompetitionById(competitionId) {
    if (!competitionId) {
        return null;
    }

    return getCompetitions().find((competition) => competition.id === competitionId) || null;
}

export function getSelectedCompetitionId() {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage.getItem(STORAGE_KEYS.selectedCompetitionId);
}

export function setSelectedCompetitionId(competitionId) {
    if (typeof window === "undefined" || !competitionId) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEYS.selectedCompetitionId, competitionId);
}

export function getSelectedCompetition() {
    const selectedCompetitionId = getSelectedCompetitionId();

    return getCompetitionById(selectedCompetitionId) || getCompetitions()[0] || null;
}

export function saveCompetition(form) {
    const safeCapacity = Math.max(4, toNumber(form.maxParticipants, 4));
    const competition = normalizeCompetition({
        id: `competition-${Date.now()}`,
        title: form.title.trim(),
        type: form.type,
        maxParticipants: safeCapacity,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
        createdAt: new Date().toISOString(),
        participants: [],
        createdById: form.createdById,
        createdByName: form.createdByName,
        savedMatchType: form.type,
        isMatchTypeLocked: true,
    });
    const nextCompetitions = [competition, ...getCompetitions()];

    writeJson(STORAGE_KEYS.competitions, nextCompetitions);
    setSelectedCompetitionId(competition.id);

    return competition;
}

export function saveCompetitionBracketState(competitionId, bracketState) {
    const competitions = getCompetitions();
    let savedCompetition = null;
    const nextCompetitions = competitions.map((competition) => {
        if (competition.id !== competitionId) {
            return competition;
        }

        savedCompetition = normalizeCompetition({
            ...competition,
            bracketParticipants: Array.isArray(bracketState?.participants)
                ? bracketState.participants
                : competition.bracketParticipants,
            bracketWinners: bracketState?.winners,
            savedMatchType: competition.type,
            isMatchTypeLocked: true,
        });

        return savedCompetition;
    });

    if (!savedCompetition) {
        return null;
    }

    writeJson(STORAGE_KEYS.competitions, nextCompetitions);

    return savedCompetition;
}

export function getProfile() {
    return getCurrentUser() || ensureProfile();
}

export function getUsers() {
    return ensureUsers();
}

export function getCurrentUser() {
    const storedCurrentUser = readJson(STORAGE_KEYS.currentUser);

    if (!storedCurrentUser) {
        return null;
    }

    return normalizeUser(storedCurrentUser);
}

export function isLoggedIn() {
    return Boolean(getCurrentUser());
}

export function registerUser(userForm) {
    const users = getUsers();
    const normalizedEmail = userForm.email.trim().toLowerCase();
    const existingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);
    const normalizedStudentId = userForm.studentId.trim();
    const existingStudent = users.find((user) => user.studentId === normalizedStudentId);

    if (existingUser) {
        return {
            success: false,
            message: "이미 가입된 이메일입니다.",
        };
    }

    if (existingStudent) {
        return {
            success: false,
            message: "이미 가입된 학번입니다.",
        };
    }

    const nextUser = normalizeUser({
        id: `user-${Date.now()}`,
        name: userForm.fullName.trim(),
        studentId: normalizedStudentId,
        email: normalizedEmail,
        password: userForm.password,
        role: "참가자",
        createdAt: new Date().toISOString(),
    });
    const nextUsers = [nextUser, ...users];

    writeJson(STORAGE_KEYS.users, nextUsers);
    writeJson(STORAGE_KEYS.profile, {
        name: nextUser.name,
        studentId: nextUser.studentId,
        phone: nextUser.phone,
        gender: nextUser.gender,
        role: nextUser.role,
    });
    setCurrentUser(nextUser);

    return {
        success: true,
        user: nextUser,
    };
}

export function loginUser({ email, identifier, password }) {
    const users = getUsers();
    const normalizedIdentifier = (identifier || email || "").trim().toLowerCase();
    const matchedUser = users.find((user) =>
        (
            user.email.toLowerCase() === normalizedIdentifier
            || user.studentId.toLowerCase() === normalizedIdentifier
        )
        && user.password === password
    );

    if (!matchedUser) {
        return {
            success: false,
            message: "이메일 또는 학번, 비밀번호를 다시 확인해주세요.",
        };
    }

    setCurrentUser(matchedUser);

    return {
        success: true,
        user: matchedUser,
    };
}

export function logoutUser() {
    setCurrentUser(null);
}

export function hasAppliedToCompetition(competition, currentUser) {
    if (!competition || !currentUser) {
        return false;
    }

    return competition.participants.some((participant) => participant.userId === currentUser.id);
}

export function applyToCompetition(competitionId, currentUser) {
    const competitions = getCompetitions();
    const targetCompetition = competitions.find((competition) => competition.id === competitionId);

    if (!targetCompetition) {
        return { success: false, reason: "not_found" };
    }

    if (!currentUser) {
        return { success: false, reason: "auth_required" };
    }

    if (hasAppliedToCompetition(targetCompetition, currentUser)) {
        return { success: false, reason: "already_joined", competition: targetCompetition };
    }

    if (targetCompetition.participants.length >= targetCompetition.maxParticipants) {
        return { success: false, reason: "full", competition: targetCompetition };
    }

    const nextParticipant = {
        id: `participant-user-${currentUser.id}`,
        userId: currentUser.id,
        team: currentUser.studentId ? `${currentUser.studentId}` : "개인 참가",
        name: currentUser.name,
    };
    const nextCompetition = {
        ...targetCompetition,
        participants: [...targetCompetition.participants, nextParticipant],
        bracketParticipants: [...targetCompetition.participants, nextParticipant],
        bracketWinners: {},
        savedMatchType: targetCompetition.type,
        isMatchTypeLocked: true,
    };
    const nextCompetitions = competitions.map((competition) =>
        competition.id === competitionId ? nextCompetition : competition
    );

    writeJson(STORAGE_KEYS.competitions, nextCompetitions);

    return { success: true, competition: nextCompetition };
}
