import { API_ROOT } from "~/constants";
import { getCookie } from "~/utils/cookies";
import { iExportOrderProps } from "~/views/types";

const getAllExportOrders = async () => {
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

    const res = await fetch(`${API_ROOT}/export/orders`, init);
    const data: iExportOrderProps[] = await res.json();

    return data;
  } catch (error) {
    console.log();
  }
};

const getExportOrderById = async (id: number) => {
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
    const res = await fetch(`${API_ROOT}/export/orders/id/${id}`, init);
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    return error;
  }
};

const createExportOrder = async (values: iExportOrderProps) => {
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
    const res = await fetch(`${API_ROOT}/export/orders`, init);

    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

const softDeleteExportOrder = async (id: number, reason: string) => {
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
      body: JSON.stringify({
        reasonFailed: reason,
      }),
    };
    const res = await fetch(`${API_ROOT}/export/orders/${id}`, init);

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
  createExportOrder,
  getAllExportOrders,
  getExportOrderById,
  softDeleteExportOrder,
};
