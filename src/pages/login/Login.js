import InputButton from "../../components/login/input-button/InputButton";
import {useState} from "react";
import SubmitButton from "../../components/login/input-button/SubmitButton";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            email,
            password,
            rememberMe,
        });
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img">
                        <path d="M8 4h8v3h4v2a6 6 0 0 1-5.2 5.9A4 4 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1a4 4 0 0 1-1.8-2A6 6 0 0 1 4 9V7h4V4Zm8 5V6h-6v6.5a3 3 0 0 0 6 0V9Zm2 0v3.7A4 4 0 0 0 20 9h-2ZM6 9a4 4 0 0 0 2 3.7V9H6Z" />
                    </svg>
                </div>

                <h1>Welcome Back</h1>
                <p className="auth-description">Sign in to manage your tournaments</p>

                <form onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="email">Email</label>
                    <div className="auth-input-wrap">
                        <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 6h16v12H4V6Zm2 2v.2l6 4.2 6-4.2V8H6Zm12 8v-5.4l-6 4.2-6-4.2V16h12Z" />
                        </svg>
                        <InputButton
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <label className="auth-label" htmlFor="password">Password</label>
                    <div className="auth-input-wrap">
                        <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7 10V8a5 5 0 0 1 10 0v2h2v10H5V10h2Zm2 0h6V8a3 3 0 0 0-6 0v2Zm-2 8h10v-6H7v6Z" />
                        </svg>
                        <InputButton
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                        />
                    </div>

                    <div className="auth-options">
                        <label className="remember-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember Me
                        </label>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>

                    <SubmitButton className="auth-login-button" text="Login" />
                    <button className="auth-back-button" type="button" onClick={handleBack}>Back</button>
                </form>

                <p className="auth-signup">
                    Don't have an account? <Link to="/signup">Create an account</Link>
                </p>
            </section>

            <p className="auth-security">Secure, encrypted login powered by BracketMaster Pro</p>

            <footer className="auth-footer">
                <p>© 2024 BracketMaster Pro. All rights reserved.</p>
                <nav aria-label="Legal links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/support">Contact Support</a>
                </nav>
            </footer>
        </main>
    );
}

export default Login;
