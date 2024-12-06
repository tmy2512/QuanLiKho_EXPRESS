import { FC, useReducer } from "react";
import StoreContext from "./Context";
import reducer, { initialState } from "./reducer";

const Provider: FC<any> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

export default Provider;
