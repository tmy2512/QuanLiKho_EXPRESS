import { API_ROOT } from "~/constants";
import { getCookie } from "~/utils/cookies";
import { iProviderProps } from "~/views/types";

const getAllProviders = async () => {
  try {
    const jwt = getCookie("jwt");
    if (!jwt) {
      console.log("Hết phiên đăng nhập");
    }
    const init: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
    };

    const res = await fetch(`${API_ROOT}/providers?permissionId=36`, init);
    const data: iProviderProps[] = await res.json();

    return data;
  } catch (error) {
    console.log();
  }
};

const getProviderById = async (id: number) => {
  try {
    const jwt = getCookie("jwt");
    if (!jwt) {
      console.log("Hết phiên đăng nhập");
    }
    const init: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
    };
    const res = await fetch(
      `${API_ROOT}/providers/${id}?permissionId=36`,
      init
    );
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    return error;
  }
};

const createProvider = async (values: iProviderProps) => {
  try {
    const jwt = getCookie("jwt");
    if (!jwt) {
      console.log("Hết phiên đăng nhập");
    }

    const init: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify(values),
    };
    const res = await fetch(`${API_ROOT}/providers?permissionId=33`, init);

    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateProvider = async (values: iProviderProps) => {
  try {
    const jwt = getCookie("jwt");
    if (!jwt) {
      console.log("Hết phiên đăng nhập");
    }

    const init: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
      body: JSON.stringify(values),
    };
    const res = await fetch(
      `${API_ROOT}/providers/${values.idProviders}?permissionId=34`,
      init
    );

    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

const softDeleteProvider = async (id: number) => {
  try {
    const jwt = getCookie("jwt");
    if (!jwt) {
      console.log("Hết phiên đăng nhập");
    }

    const init: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: jwt,
      },
    };
    const res = await fetch(
      `${API_ROOT}/providers/${id}?permissionId=35`,
      init
    );

    const data = await res.json();
    if (data && data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    error && console.log(error);
  }
};

export {
  createProvider,
  getAllProviders,
  getProviderById,
  softDeleteProvider,
  updateProvider,
};
