import { SET_AUTHENTICATION, SET_UNAUTHENTICATION } from "~/constants";
import { iActionProps, iStateProps } from "./types";
import { removeCookie } from "~/utils/cookies";

const initialState: iStateProps = {
  isAuthentication: false,
  userId: -1,
  username: "",
  name: "",
  role: 0,
};

const reducer = (state: iStateProps, action: iActionProps): iStateProps => {
  switch (action.type) {
    case SET_AUTHENTICATION:
      return (state = {
        ...action.payload,
        isAuthentication: true,
      });
    case SET_UNAUTHENTICATION:
      removeCookie("id");
      removeCookie("jwt");
      removeCookie("id_expired_at");
      removeCookie("id_expired_at");
      return (state = initialState);
    default:
      console.log("Invalid action!");
      return (state = initialState)
  }
};

export { initialState };
export default reducer;
