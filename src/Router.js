import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./pages/login/Login";

function Router() {
    return (
        <Switch>
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