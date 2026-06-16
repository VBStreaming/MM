import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/login/Login";

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
                <Login />
            </Route>
        </Switch>
    );
}

export default Router;
