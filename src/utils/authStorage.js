const USERS_KEY = "bracketmaster_users";
const CURRENT_USER_KEY = "bracketmaster_current_user";

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

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function toPublicUser(user) {
    if (!user) {
        return null;
    }

    const { password, ...publicUser } = user;
    return publicUser;
}

export function getUsers() {
    const users = readJson(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
}

export function getCurrentUser() {
    return readJson(CURRENT_USER_KEY, null);
}

export function signupUser({ fullName, studentId, email, password }) {
    const users = getUsers();
    const trimmedName = fullName.trim();
    const trimmedStudentId = studentId.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!/^\d{4}$/.test(trimmedStudentId)) {
        return {
            ok: false,
            message: "학번은 1317, 2416처럼 숫자 4자리로 입력해주세요.",
        };
    }

    if (users.some((user) => user.email === normalizedEmail)) {
        return {
            ok: false,
            message: "이미 가입된 이메일입니다.",
        };
    }

    if (users.some((user) => user.studentId === trimmedStudentId)) {
        return {
            ok: false,
            message: "이미 가입된 학번입니다.",
        };
    }

    const user = {
        id: `user-${Date.now()}`,
        fullName: trimmedName,
        studentId: trimmedStudentId,
        email: normalizedEmail,
        password,
        role: "Tournament Coordinator",
        createdAt: new Date().toISOString(),
    };

    writeJson(USERS_KEY, [...users, user]);

    const publicUser = toPublicUser(user);
    writeJson(CURRENT_USER_KEY, publicUser);

    return {
        ok: true,
        user: publicUser,
    };
}

export function loginUser({ identifier, password }) {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const users = getUsers();
    const user = users.find((savedUser) => (
        savedUser.email === normalizedIdentifier || savedUser.studentId === normalizedIdentifier
    ));

    if (!user) {
        return {
            ok: false,
            message: "가입된 이메일 또는 학번을 찾을 수 없습니다.",
        };
    }

    if (user.password !== password) {
        return {
            ok: false,
            message: "비밀번호가 일치하지 않습니다.",
        };
    }

    const publicUser = toPublicUser(user);
    writeJson(CURRENT_USER_KEY, publicUser);

    return {
        ok: true,
        user: publicUser,
    };
}

export function logoutUser() {
    if (!hasLocalStorage()) {
        return;
    }

    window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function getUserInitial(user) {
    const name = user?.fullName?.trim();
    return name ? name.charAt(0).toUpperCase() : "?";
}
