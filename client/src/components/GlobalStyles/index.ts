import { ReactElement } from "react";
import "./GlobalStyles.scss";

interface iProps {
    children: ReactElement;
}

const GlobalStyles = ({ children }: iProps) => {
    return children;
};

export default GlobalStyles;
