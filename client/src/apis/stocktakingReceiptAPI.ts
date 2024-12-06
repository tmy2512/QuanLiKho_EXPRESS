import { API_ROOT } from "~/constants";
import { getCookie } from "~/utils/cookies";
import {
  iStocktakingReceiptItemProps,
  iStocktakingReceiptProps,
  iStocktakingReport,
} from "~/views/types";

const getAllStocktakingReceipts = async () => {
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
      `${API_ROOT}/stocktaking?permissionId=44`,
      init
    );
    const data: iStocktakingReceiptItemProps[] = await res.json();

    return data;
  } catch (error) {
    console.log();
  }
};

const filterStocktakingReceiptsByDate = async (
  startDate: string,
  endDate: string
) => {
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
      `${API_ROOT}/stocktaking/date?startDate=${startDate}&endDate=${endDate}`,
      init
    );
    const data: iStocktakingReport[] = await res.json();

    return data;
  } catch (error) {
    console.log();
  }
};

const getStocktakingReceiptById = async (id: number) => {
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
      `${API_ROOT}/stocktaking/${id}?permissionId=44`,
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

const createStocktakingReceipt = async (values: iStocktakingReceiptProps) => {
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
      `${API_ROOT}/stocktaking?permissionId=41`,
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

const updateStocktakingReceipt = async (
  id: number,
  status: number,
  idUpdated: number
) => {
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
      body: JSON.stringify({ status, idUpdated }),
    };
    const res = await fetch(
      `${API_ROOT}/stocktaking/${id}?permissionId=42`,
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

export {
  createStocktakingReceipt,
  filterStocktakingReceiptsByDate,
  getAllStocktakingReceipts,
  getStocktakingReceiptById,
  updateStocktakingReceipt,
};
