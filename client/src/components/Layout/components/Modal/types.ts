interface iModalTypes {
    type: "create" | "update";
}
interface iPrintExportReceipt {
    idExportReceipts: number;
    idExportOrder: number;
    idUpdated?: number
}

export type { iModalTypes, iPrintExportReceipt };
