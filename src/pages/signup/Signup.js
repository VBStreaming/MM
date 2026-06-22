import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthTopBar from "../../components/AuthTopBar";
import InputButton from "../../components/login/input-button/InputButton";
import SubmitButton from "../../components/login/input-button/SubmitButton";
import { signupUser } from "../../utils/authStorage";
import "./Signup.css";

function Signup() {
    const history = useHistory();
    const fullNameRef = useRef(null);
    const studentIdRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [fullName, setFullName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const passwordsMatch = password === confirmPassword;
    const showPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;
    const hasValidStudentId = /^\d{4}$/.test(studentId);
    const canSubmit = fullName.trim().length > 0
        && hasValidStudentId
        && email.trim().length > 0
        && password.length > 0
        && passwordsMatch
        && agreed;

    const handleStudentIdChange = (event) => {
        setStudentId(event.target.value.replace(/\D/g, "").slice(0, 4));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!fullName.trim()) {
            setError("이름을 입력해주세요.");
            fullNameRef.current?.focus();
            return;
        }

        if (!studentId.trim()) {
            setError("학번을 입력해주세요.");
            studentIdRef.current?.focus();
            return;
        }

        if (!email.trim()) {
            setError("이메일을 입력해주세요.");
            emailRef.current?.focus();
            return;
        }

        if (!password.trim()) {
            setError("비밀번호를 입력해주세요.");
            passwordRef.current?.focus();
            return;
        }

        if (!confirmPassword.trim()) {
            setError("비밀번호 확인을 입력해주세요.");
            confirmPasswordRef.current?.focus();
            return;
        }

        if (!hasValidStudentId) {
            setError("학번은 숫자 4자리로 입력해주세요.");
            studentIdRef.current?.focus();
            return;
        }

        if (!passwordsMatch) {
            setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            confirmPasswordRef.current?.focus();
            return;
        }

        if (!agreed) {
            setError("약관 동의가 필요합니다.");
            return;
        }

        const result = signupUser({
            fullName,
            studentId,
            email,
            password,
        });

        if (!result.ok) {
            setError(result.message);
            return;
        }

        setError("");
        history.push("/mypage");
    };

    return (
        <main className="signup-page">
            <AuthTopBar mode="signup" />

            <section className="signup-card">
                <div className="signup-card-header">
                    <div className="signup-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 3 4 7v5c0 4.6 3.3 7.7 8 9 4.7-1.3 8-4.4 8-9V7l-8-4Zm0 2.2L18 8v4c0 3.4-2.2 5.8-6 6.9-3.8-1.1-6-3.5-6-6.9V8l6-2.8Zm-3 6.4 1.4-1.4 1.2 1.2L14.7 8 16 9.4l-4.4 4.8L9 11.6Z" />
                        </svg>
                    </div>
                    <h1>회원가입</h1>
                    <p>대회 관리를 시작하려면 계정을 만들어주세요</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="signup-field">
                        <label className="signup-label" htmlFor="fullName">이름</label>
                        <InputButton
                            id="fullName"
                            ref={fullNameRef}
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="홍길동"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="signup-field">
                        <label className="signup-label" htmlFor="studentId">학번</label>
                        <InputButton
                            id="studentId"
                            ref={studentIdRef}
                            value={studentId}
                            onChange={handleStudentIdChange}
                            placeholder="2416"
                            autoComplete="off"
                            inputMode="numeric"
                            maxLength="4"
                            pattern="\d{4}"
                            required
                        />
                    </div>

                    <div className="signup-field">
                        <label className="signup-label" htmlFor="signupEmail">이메일</label>
                        <InputButton
                            id="signupEmail"
                            ref={emailRef}
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="email@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="signup-password-grid">
                        <div className="signup-field">
                            <label className="signup-label" htmlFor="signupPassword">비밀번호</label>
                            <InputButton
                                id="signupPassword"
                                ref={passwordRef}
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="비밀번호"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="signup-field">
                            <label className="signup-label" htmlFor="confirmPassword">비밀번호 확인</label>
                            <InputButton
                                id="confirmPassword"
                                ref={confirmPasswordRef}
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="비밀번호 확인"
                                autoComplete="new-password"
                                aria-invalid={showPasswordMismatch}
                                aria-describedby={showPasswordMismatch ? "password-match-note" : undefined}
                                required
                            />
                        </div>
                    </div>

                    {showPasswordMismatch && (
                        <p className="signup-field-note" id="password-match-note">
                            비밀번호가 아직 일치하지 않습니다.
                        </p>
                    )}

                    {studentId.length > 0 && !hasValidStudentId && (
                        <p className="signup-field-note">
                            학번은 숫자 4자리로 입력해야 합니다.
                        </p>
                    )}

                    <label className="signup-terms">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(event) => setAgreed(event.target.checked)}
                        />
                        <span>개인정보 처리방침과 대회 운영 규칙에 동의합니다.</span>
                    </label>

                    {error && <p className="signup-form-error">{error}</p>}

                    <SubmitButton className="signup-submit-button" text="회원가입" disabled={!canSubmit} />
                </form>

                <div className="signup-divider">
                    <span>간편 가입</span>
                </div>

                <div className="signup-social-grid">
                    <button type="button" className="signup-social-button">
                        <span className="google-wordmark">구글</span>
                        <span>구글</span>
                    </button>
                    <button type="button" className="signup-social-button">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.8.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.2 9.2 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.8 1 1.7 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.8c0 .3.2.6.7.5a10.2 10.2 0 0 0 6.8-9.8C22 6.6 17.5 2 12 2Z" />
                        </svg>
                        <span>깃허브</span>
                    </button>
                </div>
            </section>

            <p className="signup-login-link">
                이미 계정이 있나요? <Link to="/login">로그인</Link>
            </p>

            <footer className="signup-footer">
                <p><strong>배민</strong> © 2026 모든 권리 보유.</p>
                <nav aria-label="정책 링크">
                    <Link to="/">개인정보 처리방침</Link>
                    <Link to="/">이용 약관</Link>
                    <Link to="/competitions">문의하기</Link>
                </nav>
            </footer>
        </main>
    );
}

export default Signup;
