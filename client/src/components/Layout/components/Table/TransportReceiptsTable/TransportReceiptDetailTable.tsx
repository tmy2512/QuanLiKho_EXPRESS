import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iTransportDetailProps, iTransportReceiptProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import TransportReceiptDetailTableRow from "./TransportReceiptDetailTableRow";

function TransportReceiptDetailTable(props: {
    listData: iTransportDetailProps[];
    setFormData: Dispatch<SetStateAction<iTransportReceiptProps>>;
    modalType: iModalTypes;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID phiếu xuất</th>
                    <th>ID đơn xuất</th>
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <TransportReceiptDetailTableRow
                              key={item.idExportReceipt}
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

export default memo(TransportReceiptDetailTable);
