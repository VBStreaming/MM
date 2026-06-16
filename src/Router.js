import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";

function Router() {
    return (
        <Switch>
            <Route exact path="/">
                <Login />
            </Route>

            <Route exact path="/body">
                <Body />
            </Route>

            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
        </Switch>
    );
}

export default Router;
