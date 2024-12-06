import { Dispatch, SetStateAction, memo } from "react";
import { iTransportDetailProps, iTransportReceiptProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";

function TransportReceiptDetailTableRow(props: {
    item: iTransportDetailProps;
    index: number;
    setFormData: Dispatch<SetStateAction<iTransportReceiptProps>>;
    modalType: iModalTypes;
}) {
    const { item, setFormData, index, modalType } = props;

    const handleConfirm = () => {
        //toggle confirm receipt detail
        // setFormData((prev) => {
        //     const currentList = [...prev.idExportOrder2.exportOrderDetails];
        //     // currentList.splice(index, 1, {
        //     //     ...item,
        //     //     checked: !item.checked,
        //     // });
        //     return {
        //         ...prev,
        //         idExportOrder2: {
        //             ...prev.idExportOrder2,
        //             exportOrderDetails: currentList,
        //         },
        //     };
        // });
    };

    return (
        <tr
            style={{
                cursor: "pointer",
            }}
        >
            <td>{item.idExportReceipt}</td>
            <td>
                {item.idExportOrder || item.idExportReceipt2?.idExportOrder}
            </td>
        </tr>
    );
}

export default memo(TransportReceiptDetailTableRow);
