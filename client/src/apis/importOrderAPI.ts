import { API_ROOT } from "~/constants";
import { getCookie } from "~/utils/cookies";
import { iImportOrderProps } from "~/views/types";

const getAllImportOrderByStatus = async (status: number) => {
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
      `${API_ROOT}/import/orders/status/${status}`,
      init
    );
    const data: iImportOrderProps[] = await res.json();

    return data;
  } catch (error) {
    console.log();
  }
};

const getImportOrderById = async (id: number) => {
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
    const res = await fetch(`${API_ROOT}/import/orders/id/${id}`, init);
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    return error;
  }
};

const createImportOrder = async (values: iImportOrderProps) => {
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
    const res = await fetch(
      `${API_ROOT}/import/orders?permissionId=19`,
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

const updateImportOrder = async (values: iImportOrderProps) => {
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
      `${API_ROOT}/import/orders/${values.idImportOrders}?permissionId=20`,
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

const updateOrderStatus = async (values: {
  idImportOrders: number;
  status: number;
  idUpdated: number;
}) => {
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
      `${API_ROOT}/import/orders/${values.idImportOrders}?permissionId=20`,
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

const softDeleteImportOrder = async (id: number, reason: string) => {
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
    const res = await fetch(`${API_ROOT}/import/orders/${id}`, init);

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
  createImportOrder,
  getAllImportOrderByStatus,
  getImportOrderById,
  softDeleteImportOrder,
  updateImportOrder,
  updateOrderStatus,
};
