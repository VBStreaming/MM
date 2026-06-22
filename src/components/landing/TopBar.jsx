import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../utils/authStorage";

function TopBar() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <header className="top-bar">
      <div className="content-container top-bar__content">
        <div className="top-bar__inner">
          <div className="top-bar__brand">Bucket Master</div>

          <div className="top-bar__actions">
            {currentUser ? (
              <>
                <span className="top-bar__user">{currentUser.fullName}님</span>
                <button
                  className="top-bar__button"
                  type="button"
                  onClick={() => history.push("/mypage")}
                >
                  마이페이지
                </button>
                <button
                  className="top-bar__link"
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
