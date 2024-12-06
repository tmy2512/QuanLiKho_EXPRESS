import { Dispatch } from "react";

interface iContextProps {
    state: iStateProps;
    dispatch: Dispatch<iActionProps>;
}
interface iStateProps {
    isAuthentication?: boolean;
    userId: number;
    username: string;
    name: string;
    role: number;
}

interface iActionProps {
    type: string;
    payload?: any;
}

export type { iContextProps, iStateProps, iActionProps };
