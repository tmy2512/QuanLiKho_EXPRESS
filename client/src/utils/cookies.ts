import Cookies from "js-cookie";

//set cookie
const setCookie = (name: string, value: string) => {
    const expired = Date.now() + 3600000; //expire in 1h
    // const expired = Date.now() + 60000; expire in 1'
    Cookies.set(name, value, {
        expires: 1 / 24,
        //1/1440 = expire in 1'
        //1 / 24 = expire in 1h
        sameSite: "Strict",
        // secure: true,
    });
    Cookies.set(`${name}_expired_at`, expired.toString(), {
        expires: 1 / 24,
        sameSite: "Strict",
        // secure: true,
    });
};

const getCookie = (cookieName: string) => {
    const cookie = Cookies.get();
    return cookie[cookieName];
};

const removeCookie = (cookieName: string) => {
    Cookies.remove(cookieName);
};

export { setCookie, getCookie, removeCookie };
