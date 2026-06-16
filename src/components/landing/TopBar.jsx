import { useHistory } from "react-router-dom";

function TopBar() {
  const history = useHistory();

  return (
    <header className="top-bar">
      <div className="content-container top-bar__content">
        <div className="top-bar__inner">
          <div className="top-bar__brand">Bucket Master</div>

          <div className="top-bar__actions">
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
