// const currentURL = window.location.href;
// const API_ROOT = currentURL.includes("localhost")
//   ? "http://localhost:3001"
//   : "https://spx-express-be.vercel.app"; //VERCEL
const API_ROOT = "https://spx-express-be.vercel.app"; //VERCEL

const QR_API_ROOT = "https://api.qrserver.com/v1/create-qr-code/?size=150x150";
const PROVINCE_API_ROOT = "https://vapi.vnappmob.com/api";
//https://vapi-vnappmob.readthedocs.io/en/latest/province.html#quick-reference

const SET_AUTHENTICATION = "set_authentication";
const SET_UNAUTHENTICATION = "set_unauthentication";

export {
  API_ROOT,
  QR_API_ROOT,
  PROVINCE_API_ROOT,
  SET_AUTHENTICATION,
  SET_UNAUTHENTICATION,
};
