import { useEffect, useState } from "react";
import { Modal, ModalBody, Spinner } from "react-bootstrap";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { getUserById } from "./apis/userAPI";
import { DefaultLayout } from "./components/Layout";
import useGlobalState from "./hooks/useGlobalState";
import { privateRoutes, publicRoutes } from "./routes/routes";
import { actions } from "./store";
import { getCookie } from "./utils/cookies";
import roleIdGenerator from "./utils/role";

function App() {
  const { state, dispatch } = useGlobalState();
  const { isAuthentication, role } = state;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    //load authentic state
    if (!isAuthentication) {
      const userId = getCookie("id");

      if (userId) {
        getUserById(+userId)
          .then((data) => {
            !data.error &&
              dispatch(
                actions.setAuthentication({
                  userId: data.idUsers,
                  username: data.username,
                  name: data.name,
                  role: roleIdGenerator(data.idPermissions),
                })
              );
            return;
          })
          .catch((error) => {
            error && dispatch(actions.setUnauthentication());
          })
          .finally(() => setLoading(false));
      } else setLoading(false);
      return;
    }
    const timeStamp = getCookie("id_expired_at");
    const currentTime = Date.now();
    const timeLeft = +timeStamp - currentTime;

    //set expire in 1h
    const expireTime = setTimeout(() => {
      alert("Đã hết phiên đăng nhập, vui lòng đăng nhập lại");
      dispatch(actions.setUnauthentication());
    }, timeLeft);

    //cleanup function
    return () => clearTimeout(expireTime);
  }, [isAuthentication, dispatch]);

  const routes = isAuthentication ? publicRoutes : privateRoutes;

  return (
    <>
      <Modal fullscreen={true} show={isLoading} animation={false}>
        <ModalBody className="d-flex align-items-sm-center justify-content-center">
          <Spinner animation="border" role="status" />
        </ModalBody>
      </Modal>

      <Router>
        <div className="App">
          <Routes>
            {routes.map((route, index) => {
              const Layout =
                route.layout === null
                  ? Fragment
                  : DefaultLayout;
              const Page = route.component;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
