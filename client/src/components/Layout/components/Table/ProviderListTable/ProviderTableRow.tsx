import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { Badge, ButtonGroup, Dropdown } from "react-bootstrap";
import { iModalTypes } from "../../Modal/types";
import { iProviderProps } from "~/views/types";
import { getProviderById, softDeleteProvider } from "~/apis/providerAPI";

function ProviderTableRow(props: {
    item: iProviderProps;
    setListData: Dispatch<SetStateAction<iProviderProps[]>>;
    index: number;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iProviderProps>>;
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
        const ProviderInfo: iProviderProps = await getProviderById(
            item.idProviders
        );
        setFormData(ProviderInfo);

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
                softDeleteProvider(id)
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
            <td>{item.idProviders}</td>
            <td>{item.name}</td>
            <td>{item.address}</td>
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
                            <i className="fa-solid fa-layer-group"></i>
                            &nbsp; Xem thông tin chi tiết
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleReadOrUpdate()}>
                            <i className="fa-solid fa-pen-to-square"></i>
                            &nbsp; Cập nhật thông tin
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handleDelete(item.idProviders)}
                        >
                            <i
                                className={
                                    item.deletedAt
                                        ? "fa-solid fa-check"
                                        : "fa-solid fa-ban"
                                }
                            ></i>
                            &nbsp;
                            {item.deletedAt ? "Kích hoạt lại" : "Vô hiệu hoá"}
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    );
}

export default memo(ProviderTableRow);
