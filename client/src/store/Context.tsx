import { createContext } from "react";
import { initialState } from "./reducer";
import { iActionProps, iContextProps } from "./types";

const Context = createContext<iContextProps>({
    state: initialState,
    dispatch: (() => null) as React.Dispatch<iActionProps>,
});

export default Context;
