import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { Badge, ButtonGroup, Dropdown } from "react-bootstrap";
import { getGoodsUnitById, softDeleteGoodsUnit } from "~/apis/goodsUnitAPI";
import { iGoodsUnitProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function GoodsUnitTableRow(props: {
    item: iGoodsUnitProps;
    setListData: Dispatch<SetStateAction<iGoodsUnitProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iGoodsUnitProps>>;
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
        const goodsUnitInfo: iGoodsUnitProps = await getGoodsUnitById(
            item.idGoodsUnits
        );
        setFormData(goodsUnitInfo);
        toggleShowModal();
        setModalType({ type: "update" });
    };

    const handleDelete = useCallback(
        (id: number) => {
            const windowObject = window;
            const message = item.deletedAt
                ? `Bạn có chắc muốn kích hoạt lại nhóm hàng "${item.name}"?`
                : `Bạn có chắc muốn vô hiệu hoá nhóm hàng "${item.name}"?`;
            const confirmDialog = windowObject.confirm(message);
            if (confirmDialog) {
                softDeleteGoodsUnit(id)
                    .then(() => {
                        setListData((prev) => {
                            //deep clone
                            const data = [...prev];
                            data.splice(index, 1, {
                                ...item,
                                deletedAt:
                                    item.deletedAt === null ? new Date() : null,
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
            <td>{item.idGoodsUnits}</td>
            <td>{item.name}</td>
            <td className="d-flex justify-content-between align-items-center">
                <div>
                    <Badge pill bg={!item.deletedAt ? "success" : "secondary"}>
                        {!item.deletedAt ? "Hoạt động" : "Vô hiệu hoá"}
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
                            <i className="fa-solid fa-ruler-horizontal"></i>
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
                                onClick={() => handleDelete(item.idGoodsUnits)}
                            >
                                <i
                                    className={
                                        item.deletedAt
                                            ? "fa-solid fa-check"
                                            : "fa-solid fa-ban"
                                    }
                                ></i>
                                &nbsp;
                                {item.deletedAt
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

export default memo(GoodsUnitTableRow);
