import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/login/Login";
import BracketPage from "./pages/bracket/BracketPage";

function Router() {
    return (
        <Switch>
            <Route exact path="/">
                <LandingPage />
            </Route>

            <Route exact path="/bracket">
                <BracketPage />
            </Route>

            <Route exact path="/body">
                <Body />
            </Route>

            <Route exact path="/login">
                <Login />
            </Route>
        </Switch>
    );
}

export default Router;
