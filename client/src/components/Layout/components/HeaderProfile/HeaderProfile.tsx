import { Nav, NavDropdown } from "react-bootstrap";
import useGlobalState from "~/hooks/useGlobalState";
import { actions } from "~/store";

function HeaderProfile() {
    const { state, dispatch } = useGlobalState();

    const handleLogout = () => {
        dispatch(actions.setUnauthentication());
    };

    return (
        <Nav>
            <NavDropdown
                style={{
                    fontWeight: "bold",
                }}
                title={state.username || "Chưa đăng nhập"}
            >
                <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                </NavDropdown.Item>
            </NavDropdown>
        </Nav>
    );
}

export default HeaderProfile;
