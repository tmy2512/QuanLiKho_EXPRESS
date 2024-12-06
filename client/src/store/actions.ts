import { SET_AUTHENTICATION, SET_UNAUTHENTICATION } from "~/constants";
import { iStateProps } from "./types";

const setAuthentication = (payload: iStateProps) => ({
    type: SET_AUTHENTICATION,
    payload,
});

const setUnauthentication = () => ({
    type: SET_UNAUTHENTICATION,
});

export { setAuthentication, setUnauthentication };
