import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iWarehouseDataProps, iWarehouseItemProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import WarehouseTableRow from "./WarehouseTableRow";

function WarehouseTable(props: {
    listData: iWarehouseItemProps[];
    setListData: Dispatch<SetStateAction<iWarehouseItemProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iWarehouseDataProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên kho</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <WarehouseTableRow
                            key={item.idWarehouse}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(WarehouseTable);
