import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { Badge, ButtonGroup, Dropdown } from "react-bootstrap";
import { getGoodsGroupById, softDeleteGoodsGroup } from "~/apis/goodsGroupAPI";
import { iModalTypes } from "../../Modal/types";
import { iImportOrderProps } from "~/views/types";
import stringToDate from "~/utils/stringToDate";
import { Variant } from "react-bootstrap/esm/types";
import {
    getImportOrderById,
    softDeleteImportOrder,
} from "~/apis/importOrderAPI";

function OrderTableRow(props: {
    tabKey: "in-process" | "finished" | "failed" | string;
    item: iImportOrderProps;
    setListData: Dispatch<SetStateAction<iImportOrderProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iImportOrderProps>>;
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

    let badgeProps: {
        bg: Variant;
        body: string;
    } = {
        bg: "",
        body: "",
    };
    switch (item.status) {
        case 0:
            badgeProps = {
                bg: "warning",
                body: "Đã tạo",
            };
            break;
        case 1:
            badgeProps = {
                bg: "primary",
                body: "KT duyệt",
            };
            break;
        case 2:
            badgeProps = {
                bg: "info",
                body: "GĐ duyệt - Đã gửi NCC",
            };
            break;
    }

    const handleReadOrUpdate = async () => {
        const orderInfo: iImportOrderProps = await getImportOrderById(
            item.idImportOrders
        );
        setFormData(orderInfo);

        toggleShowModal();
        setModalType({ type: "update" });
    };

    const handleDelete = useCallback(
        (id: number) => {
            const windowObject = window;
            const message = `Nhập lý do huỷ đơn nhập kho mã số "${item.idImportOrders}":`;
            const reasonFailed = windowObject.prompt(message)?.trim();
            if (reasonFailed) {
                softDeleteImportOrder(id, reasonFailed)
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
            <td>{item.idImportOrders}</td>
            <td>{item.idProvider2?.name}</td>
            <td>{stringToDate(item.orderDate)}</td>
            {tabKey === "in-process" && (
                <td className="d-flex justify-content-between align-items-center">
                    <div>
                        <Badge className="p-2" bg={badgeProps.bg}>
                            {badgeProps.body}
                        </Badge>
                    </div>
                    &nbsp;
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
                                <i className="fa-solid fa-box"></i>
                                &nbsp; Xem thông tin chi tiết
                            </Dropdown.Item>
                            {item.status === 0 && (
                                <Dropdown.Item
                                    onClick={() => handleReadOrUpdate()}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    &nbsp; Cập nhật thông tin
                                </Dropdown.Item>
                            )}
                            <Dropdown.Item
                                onClick={() =>
                                    handleDelete(item.idImportOrders)
                                }
                            >
                                <i className={"fa-solid fa-ban"}></i>
                                &nbsp; Huỷ đơn hàng
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            )}
            {tabKey === "failed" && <td>{item.reasonFailed}</td>}
        </tr>
    );
}

export default memo(OrderTableRow);
