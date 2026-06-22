import {
    formatDateLabel,
    getCompetitions as getLocalCompetitions,
    getCompetitionStatusInfo,
    saveCompetition as saveLocalCompetition,
} from "./localData";

function toStoredCompetition(competition) {
    const status = getCompetitionStatusInfo(competition.startDate, competition.endDate);

    return {
        ...competition,
        type: competition.type.toUpperCase(),
        registrationPeriod: `${formatDateLabel(competition.createdAt?.slice(0, 10))} - ${formatDateLabel(competition.startDate)}`,
        progressPeriod: `${formatDateLabel(competition.startDate)} - ${formatDateLabel(competition.endDate)}`,
        capacity: competition.maxParticipants,
        currentParticipants: Array.isArray(competition.participants) ? competition.participants.length : 0,
        status: status.label,
        statusKey: status.statusKey,
    };
}

export function getCompetitions() {
    return getLocalCompetitions().map((competition) => toStoredCompetition(competition));
}

export function saveCompetition(form, creator) {
    return saveLocalCompetition({
        ...form,
        createdById: creator?.id || "",
        createdByName: creator?.fullName || creator?.name || "",
    });
}

export function getCompetitionsByUser(userId) {
    if (!userId) {
        return [];
    }

    return getCompetitions().filter((competition) => competition.createdById === userId);
}
