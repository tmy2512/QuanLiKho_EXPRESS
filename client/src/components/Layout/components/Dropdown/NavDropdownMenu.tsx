import { NavDropdown } from "react-bootstrap";
import { iNavbarItem } from "../../../../constants/navbar-items";
import { Link } from "react-router-dom";

function DropdownMenu(props: {
    items: iNavbarItem;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement {
    const { items, setExpanded } = props;

    return (
        <NavDropdown id="basic-navdropdown-nav" title={items.label}>
            {items.children &&
                items.children.map((item, index) => (
                    <NavDropdown.Item
                        as={Link}
                        to={item.to}
                        key={index}
                        onClick={() => setExpanded(false)}
                    >
                        {item.label}
                    </NavDropdown.Item>
                ))}
        </NavDropdown>
    );
}

export default DropdownMenu;
