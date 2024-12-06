import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iExportReceiptItemProps, iExportReceiptProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import ProcessorTableRow from "./ProcessorTableRow";

function ProcessorTable(props: {
    tabKey: "packed" | "classified" | string;
    listData: iExportReceiptItemProps[];
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iExportReceiptProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID phiếu xuất</th>
                    <th>ID đơn xuất</th>
                    <th>Ngày xuất</th>
                    <th colSpan={3}>Mã Tỉnh thành - Quận huyện - Xã phường</th>
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <ProcessorTableRow
                              key={item.idExportReceipts}
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

export default memo(ProcessorTable);
