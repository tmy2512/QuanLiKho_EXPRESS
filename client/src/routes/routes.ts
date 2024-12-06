import Detail from "~/pages/Detail/DetailPage";
import Empty from "~/pages/Empty/Empty";
import ListData from "~/pages/ListData/ListDataPage";
import Login from "~/pages/Login/LoginPage";

interface iRoute {
    path: string;
    component: () => JSX.Element;
    layout?: string | null;
}

const publicRoutes: Array<iRoute> = [
    { path: "/", component: ListData },
    { path: "/report", component: Detail },
    { path: "/list/:category", component: ListData },
    { path: "/list/:category/:action/:id", component: ListData },
    { path: "/list/:category/:action", component: ListData },
    { path: "*", component: ListData },
];

const privateRoutes: Array<iRoute> = [
    { path: "/login", component: Login, layout: null },
    { path: "*", component: Empty, layout: null },
];

export { privateRoutes, publicRoutes };
