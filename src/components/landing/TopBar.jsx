import { useHistory } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../utils/authStorage";

function TopBar() {
    const history = useHistory();
    const currentUser = getCurrentUser();

    const handleLogout = () => {
        logoutUser();
        window.location.assign("/");
    };

    return (
        <header className="top-bar">
            <div className="content-container top-bar__content">
                <div className="top-bar__inner">
                    <button
                        className="top-bar__brand"
                        type="button"
                        onClick={() => history.push("/")}
                    >
                        배민
                    </button>

                    <div className="top-bar__actions">
                        {currentUser ? (
                            <>
                                <span className="top-bar__user">{currentUser.fullName || currentUser.name}</span>
                                <button
                                    className="top-bar__link"
                                    type="button"
                                    onClick={() => history.push("/mypage")}
                                >
                                    마이페이지
                                </button>
                                <button
                                    className="top-bar__button"
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="top-bar__link"
                                    type="button"
                                    onClick={() => history.push("/login")}
                                >
                                    로그인
                                </button>
                                <button
                                    className="top-bar__button"
                                    type="button"
                                    onClick={() => history.push("/signup")}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default TopBar;
