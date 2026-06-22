import "./Header.css";
import { Link } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/authStorage";

function Header() {
    const currentUser = getCurrentUser();

    const handleLogout = () => {
        logoutUser();
        window.location.assign("/");
    };

    return (
        <header className="site-header">
            <Link className="site-brand" to="/">
                <svg className="site-brand-mark" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h6v4H8V6H6v4H4V4Zm10 0h6v6h-2V6h-2v2h-2V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4ZM9 10h6v2h-2v2h-2v-2H9v-2Z" />
                </svg>
                <span>배민</span>
            </Link>
            <nav className="site-nav" aria-label="주요 메뉴">
                <Link to="/competitions">대회 목록</Link>
                <Link to="/bracket">대진표</Link>
                {currentUser ? (
                    <>
                        <Link className="site-user-link" to="/mypage">
                            {currentUser.fullName || currentUser.name}
                        </Link>
                        <button className="site-nav-button" type="button" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <Link to="/signup">회원가입</Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
