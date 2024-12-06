import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import stringToDate from "~/utils/stringToDate";
import { iExportReceiptItemProps, iExportReceiptProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import {
    getExportReceiptById,
    softDeleteExportReceipt,
} from "~/apis/exportReceiptAPI";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function ExportReceiptTableRow(props: {
    tabKey: "finished" | "failed" | string;
    item: iExportReceiptItemProps;
    setListData: Dispatch<SetStateAction<iExportReceiptItemProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iExportReceiptProps>>;
}) {
    const {
        tabKey,
        item,
        setListData,
        index,
        toggleShowModal,
        setModalType,
        setFormData,
    } = props;
    const role = useRole();

    const handleReadOrUpdate = async () => {
        const receiptInfo: iExportReceiptProps = await getExportReceiptById(
            item.idExportReceipts
        );
        setFormData(receiptInfo);

        toggleShowModal();
        setModalType({ type: "update" });
    };

    const handleDelete = useCallback(
        (id: number) => {
            const message = `Nhập lý do huỷ phiếu xuất kho mã số "${item.idExportReceipts}"?`;
            const reasonFailed = window.prompt(message)?.trim();
            if (reasonFailed) {
                softDeleteExportReceipt(id, reasonFailed)
                    .then(() => {
                        setListData((prev) => {
                            //deep clone
                            const data = [...prev];
                            data.splice(index, 1);
                            return data;
                        });
                    })
                    .catch((error) => console.log(error));
            }
        },
        [index, item, setListData]
    );

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
            <td>{item.idWarehouse2.name}</td>
            <td className="d-flex justify-content-between align-items-center">
                {item.exportDate &&
                    stringToDate(convertUTCToVNTime(item.exportDate))}
                &nbsp;
                {tabKey === "finished" && (
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
                            {(role === ROLE_ID.DIRECTOR_2 ||
                                role === ROLE_ID.CEO_6) && (
                                <Dropdown.Item
                                    onClick={() =>
                                        handleDelete(item.idExportReceipts)
                                    }
                                >
                                    <i className={"fa-solid fa-ban"}></i>
                                    &nbsp; Huỷ phiếu xuất
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </td>
        </tr>
    );
}

export default memo(ExportReceiptTableRow);
