import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import {
    getTransportReceiptById,
    softDeleteTransportReceipt,
} from "~/apis/transportReceiptAPI";
import stringToDate from "~/utils/stringToDate";
import {
    iTransportReceiptItemProps,
    iTransportReceiptProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import { getCookie } from "~/utils/cookies";

function TransportReceiptTableRow(props: {
    tabKey: "finished" | "failed" | string;
    item: iTransportReceiptItemProps;
    setListData: Dispatch<SetStateAction<iTransportReceiptItemProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iTransportReceiptProps>>;
}) {
    const { tabKey, item, toggleShowModal, setModalType, setFormData } = props;

    const handleReadOrUpdate = async () => {
        const receiptInfo: iTransportReceiptProps =
            await getTransportReceiptById(item.idTransportReceipts);

        let transportToDate;

        if (receiptInfo.transportToDate) {
            transportToDate = convertUTCToVNTime(receiptInfo.transportToDate);
        }

        setFormData({
            ...receiptInfo,
            transportToDate: transportToDate,
        });

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
            <td>{item.idTransportReceipts}</td>
            <td>{item.idWarehouseFrom2?.name}</td>
            <td>{stringToDate(item.transportFromDate)}</td>
            <td>{item.idWarehouseTo2?.name}</td>
            <td>
                {item.transportToDate
                    ? stringToDate(item.transportToDate)
                    : "Chưa có"}
            </td>
            {tabKey === "on_the_way" && (
                <td>
                    <Dropdown
                        as={ButtonGroup}
                        drop="start"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            className="px-3"
                        />
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleReadOrUpdate()}>
                                <i className="fa-solid fa-receipt"></i>
                                &nbsp; Xem thông tin chi tiết
                            </Dropdown.Item>
                            {item.status === 3 && (
                                <Dropdown.Item
                                    onClick={() => handleReadOrUpdate()}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    &nbsp; Cập nhật thông tin
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            )}
        </tr>
    );
}

export default memo(TransportReceiptTableRow);
