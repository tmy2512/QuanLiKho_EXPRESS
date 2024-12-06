import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "~/utils/cookies";

function Empty() {
    const navigate = useNavigate();
    const id = getCookie("id");

    useEffect(() => {
        if (!id) {
            navigate("/login");
        } else navigate("/");
    }, [id, navigate]);
    return <h1>Trang không tồn tại</h1>;
}

export default Empty;
