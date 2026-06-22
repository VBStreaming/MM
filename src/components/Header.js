import "./Header.css"
import { Link, useHistory } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/localData";

function Header() {
    const history = useHistory();
    const currentUser = getCurrentUser();

    const handleLogout = () => {
        logoutUser();
        history.push("/");
    };

    return (
        <header className="site-header">
            <Link className="site-brand" to="/">
                <svg className="site-brand-mark" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h6v4H8V6H6v4H4V4Zm10 0h6v6h-2V6h-2v2h-2V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4ZM9 10h6v2h-2v2h-2v-2H9v-2Z" />
                </svg>
                <span>BracketMaster</span>
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
                <Link to="/competitions">Tournaments</Link>
                <Link to="/brackets">Brackets</Link>
                {currentUser ? (
                    <>
                        <Link to="/mypage">My Page</Link>
                        <button className="site-nav-button" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/signup">Sign Up</Link>
                )}
            </nav>
        </header>
    )
}

export default Header;
