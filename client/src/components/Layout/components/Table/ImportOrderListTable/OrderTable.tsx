import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iImportOrderProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import OrderTableRow from "./OrderTableRow";

function OrderTable(props: {
    tabKey: "in-process" | "finished" | "failed" | string;
    listData: iImportOrderProps[];
    setListData: Dispatch<SetStateAction<iImportOrderProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iImportOrderProps>>;
}) {
    const { listData, tabKey } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nhà cung cấp</th>
                    <th>Ngày lập</th>
                    {tabKey === "in-process" && <th>Trạng thái</th>}
                    {tabKey === "failed" && <th>Lý do huỷ</th>}
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <OrderTableRow
                              key={item.idImportOrders}
                              item={item}
                              index={index}
                              {...props}
                          />
                      ))
                    : null}
            </tbody>
        </Table>
    );
}

export default memo(OrderTable);
