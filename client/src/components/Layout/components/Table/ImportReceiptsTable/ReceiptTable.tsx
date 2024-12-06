import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iModalTypes } from "../../Modal/types";
import ReceiptTableRow from "./ReceiptTableRow";
import { iImportReceiptItemProps, iImportReceiptProps } from "~/views/types";

function ReceiptTable(props: {
    tabKey: "in-process" | "finished" | "failed" | string;
    listData: iImportReceiptItemProps[];
    setListData: Dispatch<SetStateAction<iImportReceiptItemProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iImportReceiptProps>>;
}) {
    const { listData, tabKey } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID phiếu nhập</th>
                    <th>ID đơn nhập</th>
                    <th>Nhà cung cấp</th>
                    <th>Ngày nhập</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <ReceiptTableRow
                            key={item.idImportReceipts}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(ReceiptTable);
