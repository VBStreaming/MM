import { Switch, Route } from "react-router-dom";
import Body from "./components/Body";

function Router() {
    return (
        <Switch>
            <Route exact path="/body" component={Body} />/>
        </Switch>
    );
}

export default Router;