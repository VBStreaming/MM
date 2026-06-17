import { useState } from "react";
import { Link } from "react-router-dom";
import InputButton from "../../components/login/input-button/InputButton";
import SubmitButton from "../../components/login/input-button/SubmitButton";
import "./Signup.css";

function Signup() {
    const [fullName, setFullName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            fullName,
            studentId,
            email,
            password,
            confirmPassword,
            agreed,
        });
    };

    return (
        <main className="signup-page">
            <section className="signup-hero">
                <h1>Create an Account</h1>
                <p>Join the community of competitive bracket management</p>
            </section>

            <section className="signup-card">
                <form onSubmit={handleSubmit}>
                    <label className="signup-label" htmlFor="fullName">Full Name</label>
                    <InputButton
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                    />

                    <label className="signup-label" htmlFor="studentId">Student ID (학번)</label>
                    <InputButton
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="20240001"
                    />

                    <label className="signup-label" htmlFor="signupEmail">Email</label>
                    <InputButton
                        id="signupEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@university.edu"
                    />

                    <div className="signup-password-grid">
                        <div>
                            <label className="signup-label" htmlFor="signupPassword">Password</label>
                            <InputButton
                                id="signupPassword"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                            />
                        </div>

                        <div>
                            <label className="signup-label" htmlFor="confirmPassword">Confirm Password</label>
                            <InputButton
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="password"
                            />
                        </div>
                    </div>

                    <label className="signup-terms">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span>I agree to the Terms and Conditions and the Privacy Policy regarding data handling and competition rules.</span>
                    </label>

                    <SubmitButton className="signup-submit-button" text="Sign Up" />
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
                <p><strong>BracketMaster Pro</strong> © 2024 All rights reserved.</p>
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
