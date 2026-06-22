import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InputButton from "../../components/login/input-button/InputButton";
import SubmitButton from "../../components/login/input-button/SubmitButton";
import { signupUser } from "../../utils/authStorage";
import "./Signup.css";

function Signup() {
    const history = useHistory();
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
        && password.length >= 8
        && passwordsMatch
        && agreed;

    const handleStudentIdChange = (e) => {
        setStudentId(e.target.value.replace(/\D/g, "").slice(0, 4));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canSubmit) {
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
            <section className="signup-card">
                <div className="signup-card-header">
                    <div className="signup-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 3 4 7v5c0 4.6 3.3 7.7 8 9 4.7-1.3 8-4.4 8-9V7l-8-4Zm0 2.2L18 8v4c0 3.4-2.2 5.8-6 6.9-3.8-1.1-6-3.5-6-6.9V8l6-2.8Zm-3 6.4 1.4-1.4 1.2 1.2L14.7 8 16 9.4l-4.4 4.8L9 11.6Z" />
                        </svg>
                    </div>
                    <h1>Create an account</h1>
                    <p>Join the community of competitive bracket management</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="signup-field">
                        <label className="signup-label" htmlFor="fullName">Full Name</label>
                        <InputButton
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="signup-field">
                        <label className="signup-label" htmlFor="studentId">Student ID (학번)</label>
                        <InputButton
                            id="studentId"
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
                        <label className="signup-label" htmlFor="signupEmail">Email</label>
                        <InputButton
                            id="signupEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@university.edu"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="signup-password-grid">
                        <div className="signup-field">
                            <label className="signup-label" htmlFor="signupPassword">Password</label>
                            <InputButton
                                id="signupPassword"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                autoComplete="new-password"
                                minLength="8"
                                required
                            />
                        </div>

                        <div className="signup-field">
                            <label className="signup-label" htmlFor="confirmPassword">Confirm Password</label>
                            <InputButton
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="password"
                                autoComplete="new-password"
                                minLength="8"
                                aria-invalid={showPasswordMismatch}
                                aria-describedby={showPasswordMismatch ? "password-match-note" : undefined}
                                required
                            />
                        </div>
                    </div>
                    {showPasswordMismatch && (
                        <p className="signup-field-note" id="password-match-note">
                            Passwords do not match yet.
                        </p>
                    )}
                    {studentId.length > 0 && !hasValidStudentId && (
                        <p className="signup-field-note">
                            Student ID must be exactly 4 digits.
                        </p>
                    )}

                    <label className="signup-terms">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span>I agree to the Terms and Conditions and the Privacy Policy regarding data handling and competition rules.</span>
                    </label>

                    {error && <p className="signup-form-error">{error}</p>}

                    <SubmitButton className="signup-submit-button" text="Sign Up" disabled={!canSubmit} />
                </form>

                <div className="signup-divider">
                    <span>OR SIGN UP WITH</span>
                </div>

                <div className="signup-social-grid">
                    <button type="button" className="signup-social-button">
                        <span className="google-wordmark">GOOGLE</span>
                        <span>Google</span>
                    </button>
                    <button type="button" className="signup-social-button">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.8.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.2 9.2 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.8 1 1.7 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v2.8c0 .3.2.6.7.5a10.2 10.2 0 0 0 6.8-9.8C22 6.6 17.5 2 12 2Z" />
                        </svg>
                        <span>GitHub</span>
                    </button>
                </div>
            </section>

            <p className="signup-login-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>

            <footer className="signup-footer">
                <p><strong>BracketMaster Pro</strong> © 2026 All rights reserved.</p>
                <nav aria-label="Legal links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/support">Contact Support</a>
                </nav>
            </footer>
        </main>
    );
}

export default Signup;
