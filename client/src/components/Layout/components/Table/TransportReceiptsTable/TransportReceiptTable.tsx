import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import {
    iTransportReceiptItemProps,
    iTransportReceiptProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import TransportReceiptTableRow from "./TransportReceiptTableRow";

function TransportReceiptTable(props: {
    tabKey: "in-process" | "finished" | "failed" | string;
    listData: iTransportReceiptItemProps[];
    setListData: Dispatch<SetStateAction<iTransportReceiptItemProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iTransportReceiptProps>>;
}) {
    const { listData, tabKey } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID điều chuyển</th>
                    <th>Kho đi</th>
                    <th>Ngày đi</th>
                    <th>Kho đến</th>
                    <th>Ngày đến</th>
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <TransportReceiptTableRow
                              key={item.idTransportReceipts}
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

export default memo(TransportReceiptTable);
