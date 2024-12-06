import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { Badge, ButtonGroup, Dropdown } from "react-bootstrap";
import { getWarehouseById, softDeleteWarehouse } from "~/apis/warehouseAPI";
import { iWarehouseDataProps, iWarehouseItemProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import useGlobalState from "~/hooks/useGlobalState";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function WarehouseTableRow(props: {
    item: iWarehouseItemProps;
    setListData: Dispatch<SetStateAction<iWarehouseItemProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iWarehouseDataProps>>;
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
        const warehouseInfo: iWarehouseDataProps = await getWarehouseById(
            item.idWarehouse
        );
        setFormData(warehouseInfo);

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
                softDeleteWarehouse(id)
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
            <td>{item.idWarehouse}</td>
            <td>{item.name}</td>
            <td>{item.address}</td>
            <td className="d-flex justify-content-between align-items-center">
                <div>
                    <Badge
                        pill
                        bg={item.disabled === 0 ? "success" : "secondary"}
                    >
                        {item.disabled === 0 ? "Hoạt động" : "Vô hiệu hoá"}
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
                            <i className="fa-solid fa-warehouse"></i>
                            &nbsp; Xem thông tin chi tiết
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleReadOrUpdate()}>
                            <i className="fa-solid fa-pen-to-square"></i>
                            &nbsp; Cập nhật thông tin
                        </Dropdown.Item>
                        {(role === ROLE_ID.ASSURANCE_3 ||
                            role === ROLE_ID.CEO_6) && (
                            <Dropdown.Item
                                onClick={() => handleDelete(item.idWarehouse)}
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

export default memo(WarehouseTableRow);
