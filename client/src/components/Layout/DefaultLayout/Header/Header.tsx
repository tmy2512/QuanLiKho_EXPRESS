import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

import { useEffect, useState } from "react";
import useRole from "~/hooks/useRole";
import navbar_items, { iNavbarItem } from "../../../../constants/navbar-items";
import DropdownMenu from "../../components/Dropdown/NavDropdownMenu";
import HeaderProfile from "../../components/HeaderProfile/HeaderProfile";

function Header() {
    const role = useRole();
    const [navbarItems, setNavbarItems] = useState<iNavbarItem[]>([]);

    useEffect(() => {
        //FILTER HEADER BY ROLE
        let filteredNavbarItems: iNavbarItem[] = [];
        const handleFilterNavbarItems = (navbarItems?: iNavbarItem[]) => {
            return (
                navbarItems &&
                navbarItems.filter((item) => item.roleIds.indexOf(role) >= 0)
            );
        };
        //ORIGINAL NAVBAR ITEMS MUST BE CLONE DEEPLY
        filteredNavbarItems =
            handleFilterNavbarItems(JSON.parse(JSON.stringify(navbar_items))) ||
            [];
        filteredNavbarItems.forEach((item) => {
            item.children = handleFilterNavbarItems(item.children);
        });

        setNavbarItems(filteredNavbarItems);
        //
    }, [role]);

    const [expanded, setExpanded] = useState(true);

    return (
        <Navbar
            collapseOnSelect
            expanded={expanded}
            expand="xl"
            sticky="top"
            className="mb-3"
            style={{
                backgroundColor: "white",
                boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            }}
        >
            <Container>
                <NavLink className="navbar-brand" to="/">
                    <img
                        width="75px"
                        height="30px"
                        src="https://deo.shopeemobile.com/shopee/shopee-spx-live-vn/static/media/spx-express.f3023639.svg"
                        alt="SPX Express"
                    />
                    &nbsp;Quản lý kho&nbsp;
                </NavLink>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                />
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    className="justify-content-between"
                >
                    <Nav navbarScroll>
                        {navbarItems.length &&
                            navbarItems.map((item, index) => (
                                <Fragment key={index}>
                                    {item.children ? (
                                        <DropdownMenu
                                            items={item}
                                            setExpanded={setExpanded}
                                        />
                                    ) : (
                                        <Nav.Link
                                            as={Link}
                                            to={item.to}
                                            onClick={() => setExpanded(false)}
                                        >
                                            {item.label}
                                        </Nav.Link>
                                    )}
                                </Fragment>
                            ))}
                    </Nav>
                    <HeaderProfile />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
