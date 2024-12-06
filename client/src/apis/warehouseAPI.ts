import { API_ROOT } from "~/constants";
import { getCookie } from "~/utils/cookies";
import {
  iGoodsProps,
  iWarehouseDataProps,
  iWarehouseItemProps,
} from "~/views/types";

const getAllWarehouses = async () => {
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

    const res = await fetch(`${API_ROOT}/warehouses?permissionId=40`, init);
    const data: iWarehouseItemProps[] = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const getWarehouseById = async (id: number) => {
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
      `${API_ROOT}/warehouses/id/${id}?permissionId=40`,
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

const getWarehousesByProvince = async (provinceCode: string) => {
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
      `${API_ROOT}/warehouses/province/${provinceCode}?permissionId=40`,
      init
    );

    if (res.status === 404) {
      console.log();
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    return [];
  }
};

const getWarehouseSlotsById = async (id: number) => {
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
      `${API_ROOT}/warehouses/slots/${id}?permissionId=40`,
      init
    );
    const data: {
      idWarehouse: number;
      totalFloors: number;
      totalSlots: number;
      goods: iGoodsProps[];
      error?: string;
    } = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    return error;
  }
};

const createWarehouse = async (values: iWarehouseDataProps) => {
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
    const res = await fetch(`${API_ROOT}/warehouses?permissionId=37`, init);

    const data = await res.json();
    if (data.error) {
      console.log(data.error);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateWarehouse = async (values: iWarehouseDataProps) => {
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
      `${API_ROOT}/warehouses/${values.idWarehouse}?permissionId=38`,
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

const softDeleteWarehouse = async (id: number) => {
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
      `${API_ROOT}/warehouses/${id}?permissionId=39`,
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
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  getWarehousesByProvince,
  getWarehouseSlotsById,
  softDeleteWarehouse,
  updateWarehouse,
};
