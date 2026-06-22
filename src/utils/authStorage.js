import {
    getCurrentUser as getLocalCurrentUser,
    getUsers as getLocalUsers,
    loginUser as loginLocalUser,
    logoutUser as logoutLocalUser,
    registerUser,
} from "./localData";

function toPublicUser(user) {
    if (!user) {
        return null;
    }

    return {
        ...user,
        fullName: user.name,
    };
}

export function getUsers() {
    return getLocalUsers().map((user) => toPublicUser(user));
}

export function getCurrentUser() {
    return toPublicUser(getLocalCurrentUser());
}

export function signupUser({ fullName, studentId, email, password }) {
    const result = registerUser({
        fullName,
        studentId,
        email,
        password,
    });

    if (!result.success) {
        return {
            ok: false,
            message: result.message,
        };
    }

    return {
        ok: true,
        user: toPublicUser(result.user),
    };
}

export function loginUser({ email, password }) {
    const result = loginLocalUser({
        email,
        password,
    });

    if (!result.success) {
        return {
            ok: false,
            message: result.message,
        };
    }

    return {
        ok: true,
        user: toPublicUser(result.user),
    };
}

export function logoutUser() {
    logoutLocalUser();
}

export function getUserInitial(user) {
    const name = user?.fullName?.trim() || user?.name?.trim();

    return name ? name.charAt(0).toUpperCase() : "?";
}
