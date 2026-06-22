import { useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import AuthTopBar from "../../components/AuthTopBar";
import InputButton from "../../components/login/input-button/InputButton";
import SubmitButton from "../../components/login/input-button/SubmitButton";
import { loginUser } from "../../utils/authStorage";
import "./Login.css";

function Login() {
    const history = useHistory();
    const location = useLocation();
    const identifierRef = useRef(null);
    const passwordRef = useRef(null);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const canSubmit = identifier.trim().length > 0 && password.trim().length > 0;

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!identifier.trim()) {
            setError("이메일 또는 학번을 입력해주세요.");
            identifierRef.current?.focus();
            return;
        }

        if (!password.trim()) {
            setError("비밀번호를 입력해주세요.");
            passwordRef.current?.focus();
            return;
        }

        const result = loginUser({
            identifier,
            password,
        });

        if (!result.ok) {
            setError(result.message);
            return;
        }

        setError("");
        history.push(location.state?.redirectTo || "/mypage");
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <main className="auth-page">
            <AuthTopBar mode="login" />

            <section className="auth-card">
                <div className="auth-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="M8 4h8v7a4 4 0 0 1-8 0V4Z" />
                            <path d="M6 7H4v2a5 5 0 0 0 4 4.9" />
                            <path d="M18 7h2v2a5 5 0 0 1-4 4.9" />
                            <path d="M12 15v4" />
                            <path d="M8 20h8" />
                        </g>
                    </svg>
                </div>

                <h1>다시 오신 걸 환영합니다</h1>
                <p className="auth-description">대회 관리를 위해 로그인하세요</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="identifier">이메일 또는 학번</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 6h16v12H4V6Zm2 2v.2l6 4.2 6-4.2V8H6Zm12 8v-5.4l-6 4.2-6-4.2V16h12Z" />
                            </svg>
                            <InputButton
                                id="identifier"
                                ref={identifierRef}
                                type="text"
                                value={identifier}
                                onChange={(event) => setIdentifier(event.target.value)}
                                placeholder="email@example.com 또는 2416"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">비밀번호</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M7 10V8a5 5 0 0 1 10 0v2h2v10H5V10h2Zm2 0h6V8a3 3 0 0 0-6 0v2Zm-2 8h10v-6H7v6Z" />
                            </svg>
                            <InputButton
                                id="password"
                                ref={passwordRef}
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="비밀번호"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-options">
                        <label className="remember-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) => setRememberMe(event.target.checked)}
                            />
                            로그인 상태 기억
                        </label>
                        <Link to="/signup">비밀번호를 잊으셨나요?</Link>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <div className="auth-actions">
                        <SubmitButton className="auth-login-button" text="로그인" disabled={!canSubmit} />
                        <button className="auth-back-button" type="button" onClick={handleBack}>뒤로 가기</button>
                    </div>
                </form>

                <p className="auth-signup">
                    계정이 없으신가요? <Link to="/signup">회원가입하기</Link>
                </p>
            </section>

            <p className="auth-security">배민에서 안전하게 대회를 관리하세요</p>

            <footer className="auth-footer">
                <p>© 2026 배민. 모든 권리 보유.</p>
                <nav aria-label="정책 링크">
                    <Link to="/">개인정보 처리방침</Link>
                    <Link to="/">이용 약관</Link>
                    <Link to="/competitions">문의하기</Link>
                </nav>
            </footer>
        </main>
    );
}

export default Login;
