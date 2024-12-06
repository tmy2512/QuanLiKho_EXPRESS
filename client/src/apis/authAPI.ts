import { API_ROOT } from "~/constants";

const postLogin = async (loginData: { username: string; password: string }) => {
  try {
    const init: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    };
    const res = await fetch(`${API_ROOT}/auth/login`, init);
    const data: {
      userId: number;
      username: string;
      name: string;
      token: string;
      idPermissions: number[];
      error?: string;
    } = await res.json();

    return data;
  } catch (error) {
    console.log();
  }
};

export { postLogin };
