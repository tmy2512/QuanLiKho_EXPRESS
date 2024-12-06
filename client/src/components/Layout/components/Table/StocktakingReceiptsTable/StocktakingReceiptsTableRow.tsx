import { Dispatch, SetStateAction, memo } from "react";
import { getStocktakingReceiptById } from "~/apis/stocktakingReceiptAPI";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import stringToDate from "~/utils/stringToDate";
import {
    iStocktakingReceiptItemProps,
    iStocktakingReceiptProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";

function StocktakingReceiptsTableRow(props: {
    item: iStocktakingReceiptItemProps;
    setListData: Dispatch<SetStateAction<iStocktakingReceiptItemProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iStocktakingReceiptProps>>;
}) {
    const {
        item,
        setListData,
        index,
        toggleShowModal,
        setModalType,
        setFormData,
    } = props;

    const handleReadOrUpdate = async () => {
        const receiptInfo: iStocktakingReceiptProps =
            await getStocktakingReceiptById(item.idStocktakingReceipts);
        setFormData(receiptInfo);

        toggleShowModal();
        setModalType({ type: "update" });
    };

    return (
        <tr
            title="Click để xem / chỉnh sửa thông tin"
            style={{
                cursor: "pointer",
            }}
            onClick={() => handleReadOrUpdate()}
        >
            <td>{item.idStocktakingReceipts}</td>
            <td>{item.idWarehouse2.name}</td>
            <td className="d-flex justify-content-between align-items-center">
                {item.date && stringToDate(convertUTCToVNTime(item.date))}
            </td>
        </tr>
    );
}

export default memo(StocktakingReceiptsTableRow);
