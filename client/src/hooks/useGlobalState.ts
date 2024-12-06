import { useContext } from "react";
import { StoreContext } from "~/store";

const useGlobalState = () => {
    const { state, dispatch } = useContext(StoreContext);

    return { state, dispatch };
};

export default useGlobalState;
