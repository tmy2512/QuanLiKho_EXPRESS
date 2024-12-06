//USERS
interface iUserDataProps {
    idUsers?: number;
    name: string;
    email: string;
    gender: "M" | "F" | "O" | "";
    phone: string;
    startDate: string;
    username: string;
    password?: string;
    idCreated?: number;
    usernameCreated?: string;
    createdAt?: Date;
    disabled: 0;
    idPermissions: number[];
    idUpdated?: number;
    usernameUpdated?: string;
    updatedAt?: Date;
}

interface iUserItemProps {
    idUsers: number;
    name: string;
    username: string;
    disabled: 0 | 1;
}
//WAREHOUSES
interface iWarehouseDataProps {
    idWarehouse?: number;
    name: string;
    address: string;
    provinceCode: string;
    totalFloors: number;
    totalSlots: number;
    idCreated?: number;
    usernameCreated?: string;
    createdAt?: Date;
    disabled: 0;
    idUpdated?: number;
    usernameUpdated?: string;
    updatedAt?: Date;
}
interface iWarehouseItemProps {
    idWarehouse: number;
    name: string;
    address: string;
    provinceCode: string;
    totalFloors?: number;
    totalSlots?: number;
    disabled: 0 | 1;
}
//GOODS
interface iGoodsGroupProps {
    idGoodsGroups: number;
    name: string;
    deletedAt?: Date | null;
}

interface iGoodsUnitProps {
    idGoodsUnits: number;
    name: string;
    deletedAt?: Date | null;
}

interface iGoodsTypeProps {
    idGoodsTypes: number;
    idGoodsGroup: number;
    idGoodsGroup2?: iGoodsGroupProps;
    name: string;
    deletedAt?: Date | null;
}
//PROVIDERS
interface iProviderProps {
    idProviders: number;
    name: string;
    address: string;
    deletedAt?: Date | null;
}

//GOODS
interface iGoodsProps {
    idGoods: number;
    idType: number;
    idUnit: number;
    idWarehouse: number;
    name: string;
    floor: number;
    slot: number;
    importDate: string;
    exp: string;
    amount: number;
    idCreated: number;
    usernameCreated?: string;
    createdAt: Date;
    idUpdated?: number | null;
    usernameUpdated?: string;
    updatedAt?: Date | null;
    disabled: 0 | 1;
    isHeavy: boolean;
}
interface iGoodsItemProps {
    idGoods: number;
    name: string;
    importDate?: string;
    exp?: string;
    amount: number;
    disabled: 0 | 1;
    idUnit2?: iGoodsUnitProps;
    floor?: number;
    slot?: number;
    isHeavy: boolean;
}

// IMPORT ORDERS
interface iImportOrderProps {
    idCreated: number;
    idImportOrders: number;
    orderDate: string;
    idProvider: number;
    status: number;
    importOrderDetails: iImportOrderDetailProps[];
    idProvider2?: iProviderProps;
    reasonFailed?: string;
    idUpdated?: number;
    updatedAt?: string;
    usernameCreated?: string;
    usernameUpdated?: string;
    palletCode: number;
}
interface iImportOrderDetailProps {
    idImportOrderDetails?: number;
    idImportOrder?: number;
    idGoods: number;
    amount: number;
    exp?: string;
    checked?: boolean;
}

//IMPORT RECEIPTS
interface iImportReceiptItemProps {
    idImportReceipts: number;
    idWarehouse: number;
    idWarehouse2: iWarehouseDataProps;
    idImportOrder: number;
    importDate: string;
    status: number;
}
interface iImportReceiptProps {
    idImportReceipts: number;
    idWarehouse: number;
    idImportOrder: number;
    idProvider: number;
    idUserImport: number;
    importDate: string;
    status: number;
    idUpdated?: number;
    updatedAt?: string;
    idImportOrder2: iImportOrderProps;
    idProvider2?: iProviderProps;
    idWarehouse2?: iWarehouseDataProps;
    usernameCreated: string;
    usernameUpdated?: string;
}

//EXPORT ORDER PROPS
interface iExportOrderProps {
    idExportOrders?: number;
    orderDate: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    address: string;
    status?: number;
    exportOrderDetails: iExportDetailProps[];
}

interface iExportDetailProps {
    idExportOrderDetails?: number;
    idExportOrder?: number;
    idGoods: number;
    idGoods2?: iGoodsProps;
    amount: number;
    checked?: boolean;
}

interface iExportReceiptItemProps {
    idExportReceipts: number;
    idWarehouse: number;
    idWarehouse2: iWarehouseDataProps;
    idExportOrder2: iExportOrderProps;
    exportDate: string;
    status: number;
    reasonFailed?: string;
}
//EXPORT RECEIPT PROPS
interface iExportReceiptProps {
    idExportReceipts: number;
    idWarehouse: number;
    idExportOrder: number;
    idUserExport: number;
    exportDate: string;
    palletCode: number;
    status: number;
    idUpdated?: number;
    updatedAt?: string;
    idExportOrder2: iExportOrderProps;
    idWarehouse2?: iWarehouseDataProps;
    usernameCreated: string;
    usernameUpdated?: string;
}

//TRANSPORT RECEIPT PROPS
interface iTransportReceiptProps {
    idTransportReceipts?: number;
    idUserSend: number;
    idUserReceive?: number;
    transportFromDate: string;
    transportToDate?: string;
    idWarehouseFrom: number;
    idWarehouseTo?: number;
    plateNumber: string;
    transportDetails: iTransportDetailProps[];
    status: number;
    idUserSend2?: {
        idUsers: number;
        username: string;
    };
    idUserReceive2?: {
        idUsers: number;
        username: string;
    };
    idWarehouseFrom2?: {
        idWarehouse: number;
        name: string;
        address: string;
        provinceCode: string;
    };
    idWarehouseTo2?: {
        idWarehouse: number;
        name: string;
        address: string;
        provinceCode: string;
    };
    idUpdated?: number;
    updatedAt?: string;
}
interface iTransportReceiptItemProps {
    idTransportReceipts: number;
    transportFromDate: string;
    transportToDate: string;
    idWarehouseFrom: number;
    idWarehouseTo?: number;
    status: number;
    idWarehouseFrom2?: {
        idWarehouse: number;
        name: string;
        address: string;
    };
    idWarehouseTo2?: {
        idWarehouse: number;
        name: string;
        address: string;
    };
}
interface iTransportDetailProps {
    idTransportDetails?: number;
    idTransportReceipt?: number;
    idExportReceipt: number;
    idExportOrder?: number;
    idExportReceipt2?: iExportReceiptProps;
}

//STOCKTAKING RECEIPT
interface iStocktakingReceiptProps {
    idStocktakingReceipts: number;
    idWarehouse: number;
    idWarehouse2?: iWarehouseDataProps;
    date: string;
    idUser: number;
    idUser2?: iUserDataProps;
    idUpdated?: number;
    updatedAt?: string;
    stocktakingDetails: iStocktakingDetail[];
}

interface iStocktakingReceiptItemProps {
    idStocktakingReceipts: number;
    idWarehouse2: iWarehouseDataProps;
    date: string;
}

interface iStocktakingDetail {
    idStocktakingDetails?: number;
    idReceipt?: number;
    idGoods: number;
    amount: number;
    storedAmount?: number;
    quality: string;
    solution?: string;
    idGoods2?: iGoodsProps;
}

//REPORT
interface iReport {
    startDate: string;
    endDate: string;
    goods: iGoodsItemProps[];
    importReceipts: iImportReport[];
    exportReceipts: iExportReport[];
    stocktakingReceipts: iStocktakingReport[];
    reportDetails: iReportDetail[];
    userCreated: string;
}
interface iReportDetail {
    idGoods: number;
    name: string;
    unit: string;
    beginningAmount: number;
    importedAmount: number;
    exportedAmount: number;
    endedAmount: number;
}

interface iImportReport {
    idImportReceipts: number;
    status: number;
    importDate: string;
    idWarehouse2: {
        idWarehouse: number;
        name: string;
        provinceCode: string;
    };
    idImportOrder2: {
        idImportOrders: number;
        importOrderDetails: {
            idImportOrderDetails: number;
            amount: number;
            idGoods2: {
                idGoods: number;
                amount: number;
                name: string;
                idUnit2: {
                    idGoodsUnits: number;
                    name: string;
                };
            };
        }[];
    };
}

interface iExportReport {
    idExportReceipts: number;
    status: number;
    exportDate: string;
    idWarehouse2: {
        idWarehouse: number;
        name: string;
        provinceCode: string;
    };
    idExportOrder2: {
        idExportOrders: number;
        exportOrderDetails: {
            idExportOrderDetails: number;
            amount: number;
            idGoods2: {
                idGoods: number;
                amount: number;
                name: string;
                idUnit2: {
                    idGoodsUnits: number;
                    name: string;
                };
            };
        }[];
    };
}

interface iStocktakingReport {
    idStocktakingReceipts: number;
    date: string;
    idWarehouse2: {
        idWarehouse: number;
        name: string;
        provinceCode: string;
    };
    stocktakingDetails: {
        idStocktakingDetails: number;
        amount: number;
        storedAmount: number;
        idGoods2: {
            idGoods: number;
            amount: number;
            name: string;
            idUnit2: {
                idGoodsUnits: number;
                name: string;
            };
        };
    }[];
}

export type {
    iUserDataProps,
    iUserItemProps,
    iWarehouseDataProps,
    iWarehouseItemProps,
    iGoodsGroupProps,
    iGoodsUnitProps,
    iGoodsTypeProps,
    iProviderProps,
    iGoodsItemProps,
    iGoodsProps,
    iImportOrderProps,
    iImportOrderDetailProps,
    iImportReceiptProps,
    iImportReceiptItemProps,
    iExportOrderProps,
    iExportDetailProps,
    iExportReceiptItemProps,
    iExportReceiptProps,
    iTransportReceiptProps,
    iTransportReceiptItemProps,
    iTransportDetailProps,
    iStocktakingReceiptProps,
    iStocktakingReceiptItemProps,
    iStocktakingDetail,
    iReport,
    iImportReport,
    iExportReport,
    iStocktakingReport,
    iReportDetail,
};
