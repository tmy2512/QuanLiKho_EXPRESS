import useGlobalState from "./useGlobalState";

function useRole() {
    const { state } = useGlobalState();
    return state.role;
}

export default useRole;
