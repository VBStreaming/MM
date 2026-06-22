const COMPETITIONS_KEY = "bracketmaster_competitions";

function hasLocalStorage() {
    return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson(key, fallbackValue) {
    if (!hasLocalStorage()) {
        return fallbackValue;
    }

    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallbackValue;
    } catch {
        return fallbackValue;
    }
}

function writeJson(key, value) {
    if (!hasLocalStorage()) {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    return dateValue.replace(/-/g, ".");
}

export function getCompetitions() {
    const competitions = readJson(COMPETITIONS_KEY, []);
    return Array.isArray(competitions) ? competitions : [];
}

export function saveCompetition(form, creator) {
    const competitions = getCompetitions();
    const competition = {
        id: `competition-${Date.now()}`,
        type: form.type.toUpperCase(),
        title: form.title.trim(),
        registrationPeriod: `생성: ${new Date().toLocaleDateString("ko-KR")}`,
        progressPeriod: `${formatDate(form.startDate)} - ${formatDate(form.endDate)}`,
        participants: 0,
        capacity: Number(form.maxParticipants),
        status: "접수 중",
        statusKey: "recruiting",
        description: form.description.trim(),
        createdAt: new Date().toISOString(),
        createdById: creator.id,
        createdByName: creator.fullName,
    };

    writeJson(COMPETITIONS_KEY, [competition, ...competitions]);
    return competition;
}

export function getCompetitionsByUser(userId) {
    if (!userId) {
        return [];
    }

    return getCompetitions().filter((competition) => competition.createdById === userId);
}
