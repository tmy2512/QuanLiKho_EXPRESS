import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { Badge, ButtonGroup, Dropdown } from "react-bootstrap";
import { iModalTypes } from "../../Modal/types";
import { iGoodsItemProps, iGoodsProps } from "~/views/types";
import { getGoodsById, softDeleteGoods } from "~/apis/goodsAPI";
import stringToDate from "~/utils/stringToDate";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function GoodsTableRow(props: {
    item: iGoodsItemProps;
    setListData: Dispatch<SetStateAction<iGoodsItemProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iGoodsProps>>;
}) {
    const {
        item,
        setListData,
        index,
        toggleShowModal,
        setModalType,
        setFormData,
    } = props;
    const role = useRole();

    const handleReadOrUpdate = async () => {
        const goodsInfo: iGoodsProps = await getGoodsById(item.idGoods);

        const importDate = convertUTCToVNTime(goodsInfo.importDate);
        setFormData({
            ...goodsInfo,
            importDate: importDate,
        });

        toggleShowModal();
        setModalType({ type: "update" });
    };

    const handleDelete = useCallback(
        (id: number) => {
            const windowObject = window;
            const message = item.disabled
                ? `Bạn có chắc muốn kích hoạt lại kho hàng "${item.name}"?`
                : `Bạn có chắc muốn vô hiệu hoá kho hàng "${item.name}"?`;
            const confirmDialog = windowObject.confirm(message);
            if (confirmDialog) {
                softDeleteGoods(id)
                    .then(() => {
                        setListData((prev) => {
                            //deep clone
                            const data = [...prev];
                            data.splice(index, 1, {
                                ...item,
                                disabled: item.disabled ? 0 : 1,
                            });

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
            <td>{item.idGoods}</td>
            <td>{item.name}</td>
            <td>{item.amount}</td>
            <td>{item.exp && stringToDate(item.exp.toString())}</td>
            <td className="d-flex justify-content-between align-items-center">
                <div>
                    <Badge
                        pill
                        bg={item.disabled === 0 ? "success" : "secondary"}
                    >
                        {item.disabled === 0 ? "Có sẵn" : "Không có sẵn"}
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
                        {(role === ROLE_ID.ASSURANCE_3 ||
                            role === ROLE_ID.OPERATION_1 ||
                            role === ROLE_ID.CEO_6) && (
                            <Dropdown.Item onClick={() => handleReadOrUpdate()}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                &nbsp; Cập nhật thông tin
                            </Dropdown.Item>
                        )}
                        {(role === ROLE_ID.ASSURANCE_3 ||
                            role === ROLE_ID.CEO_6) && (
                            <Dropdown.Item
                                onClick={() => handleDelete(item.idGoods)}
                            >
                                <i
                                    className={
                                        item.disabled
                                            ? "fa-solid fa-check"
                                            : "fa-solid fa-ban"
                                    }
                                ></i>
                                &nbsp;
                                {item.disabled
                                    ? "Kích hoạt lại"
                                    : "Vô hiệu hoá"}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    );
}

export default memo(GoodsTableRow);
