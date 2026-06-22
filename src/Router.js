import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";
import DashboardLayout from "./components/DashboardLayout";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import MyPage from "./pages/mypage/MyPage";
import BracketPage from "./pages/bracket/BracketPage";
import CompetitionCreate from "./pages/competition-create/CompetitionCreate";
import RallyListPage from "./pages/rally/RallyListPage";

function DashboardPage({ children }) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}

function Router() {
    return (
        <Switch>
            <Route exact path="/">
                <LandingPage />
            </Route>

            <Route exact path={["/bracket", "/bracket/:competitionId", "/brackets"]}>
                <DashboardPage>
                    <BracketPage />
                </DashboardPage>
            </Route>

            <Route exact path="/competitions/new">
                <DashboardPage>
                    <CompetitionCreate />
                </DashboardPage>
            </Route>

            <Route exact path={["/rally", "/competitions", "/tournaments"]}>
                <DashboardPage>
                    <RallyListPage />
                </DashboardPage>
            </Route>

            <Route exact path="/body">
                <DashboardPage>
                    <Body />
                </DashboardPage>
            </Route>

            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route exact path="/mypage">
                <MyPage />
            </Route>
        </Switch>
    );
}

export default Router;
