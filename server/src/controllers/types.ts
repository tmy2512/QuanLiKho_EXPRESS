//IMPORT ORDER
interface iCreateOrderRequestBody {
  idProvider: number
  palletCode: number
  importOrderDetails: iCreateOrderDetail[]
  idCreated: number
}

interface iCreateOrderDetail {
  idGoods: number
  amount: number
}

interface iUpdateOrderRequestBody {
  idProvider?: number
  palletCode: number
  importOrderDetails?: iOrderDetail[]
  status?: number
  idUpdated: number
  reasonFailed?: string
}

interface iOrderDetail {
  idImportOrderDetails?: number
  idGoods: number
  amount: number
  exp: string
}
//IMPORT RECEIPT
interface iImportReceiptRequestBody {
  idImportReceipts: number
  idWarehouse: number
  idProvider: number
  idImportOrder: number
  idUserImport: number
  importDate: string
  status: number
  idUpdated: number
  updatedAt: string
}
//EXPORT ORDERS
interface iExportOrderReqBody {
  provinceCode: string
  districtCode: string
  wardCode: string
  address: string
  status: number
  exportOrderDetails: iExportDetail[]
}
interface iExportDetail {
  idExportOrderDetails: number
  idGoods: number
  amount: number
}
//EXPORT RECEIPT
interface iExportReceiptReqBody {
  idWarehouse: number
  idExportOrder: number
  idUserExport: number
  exportDate: string
  palletCode: number
  status: number
  idUpdated: number
  reasonFailed: string
}
//TRANSPORT RECEIPT
interface iTransportReceipt {
  transportFromDate: string
  transportToDate: string
  idWarehouseFrom: number
  idWarehouseTo: number
  idUserSend: number
  idUserReceive: number
  plateNumber: string
  transportDetails: iTransportDetail[]
  status: number
  idUpdated?: number
  updatedAt?: string
}
interface iTransportDetail {
  idTransportDetails?: number
  idTransportReceipt?: number
  idExportReceipt: number
}

//STOCK TAKING
interface iStocktakingReceiptReqBody {
  date: string
  idWarehouse: number
  idUser: number
  idUpdated?: number
  updatedAt?: string
  stocktakingDetails: iStocktakingDetail[]
}
interface iStocktakingDetail {
  idStocktakingDetails?: number
  idReceipt?: number
  idGoods: number
  amount: number
  storedAmount: number
  quality: string
  solution: string
}

export type {
  iCreateOrderRequestBody,
  iUpdateOrderRequestBody,
  iImportReceiptRequestBody,
  iExportOrderReqBody,
  iExportReceiptReqBody,
  iTransportReceipt,
  iStocktakingReceiptReqBody
}
