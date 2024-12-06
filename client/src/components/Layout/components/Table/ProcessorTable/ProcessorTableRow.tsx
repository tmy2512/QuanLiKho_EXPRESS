import { Dispatch, SetStateAction, memo } from "react";
import { getExportReceiptById } from "~/apis/exportReceiptAPI";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import stringToDate from "~/utils/stringToDate";
import { iExportReceiptItemProps, iExportReceiptProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";

function ProcessorTable(props: {
    tabKey: "finished" | "failed" | string;
    item: iExportReceiptItemProps;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iExportReceiptProps>>;
}) {
    const { item, toggleShowModal, setModalType, setFormData } = props;

    const handleReadOrUpdate = async () => {
        const receiptInfo: iExportReceiptProps = await getExportReceiptById(
            item.idExportReceipts
        );
        setFormData(receiptInfo);

        toggleShowModal();
        setModalType({ type: "update" });
    };

    return (
        <tr
            title="Click để xem thông tin"
            style={{
                cursor: "pointer",
            }}
            onClick={() => handleReadOrUpdate()}
        >
            <td>{item.idExportReceipts}</td>
            <td>{item.idExportOrder2.idExportOrders}</td>
            <td className="d-flex justify-content-between align-items-center">
                {item.exportDate &&
                    stringToDate(convertUTCToVNTime(item.exportDate))}
            </td>
            <td>{item.idExportOrder2.provinceCode}</td>
            <td>{item.idExportOrder2.districtCode}</td>
            <td>{item.idExportOrder2.wardCode}</td>
        </tr>
    );
}

export default memo(ProcessorTable);
