import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Header from "./components/Header";
import MyPage from "./pages/mypage/MyPage";

function Router() {
    return (
        <Switch>
            <Route exact path="/">
                <LandingPage />
            </Route>

            <Route exact path="/body">
                <Body />
            </Route>

            <Route exact path="/login">
                <Header />
                <Login />
            </Route>
            <Route exact path="/signup">
                <Header />
                <Signup />
            </Route>
            <Route exact path="/mypage">
                <MyPage />
            </Route>
        </Switch>
    );
}

export default Router;
