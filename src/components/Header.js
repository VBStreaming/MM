import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="app-header">
            <Link className="logo" to="/bracket">BracketMaster</Link>
            <nav>
                <Link to="/bracket">대진표</Link>
                <Link to="/login">로그인</Link>
            </nav>
        </header>
    )
}

export default Header;