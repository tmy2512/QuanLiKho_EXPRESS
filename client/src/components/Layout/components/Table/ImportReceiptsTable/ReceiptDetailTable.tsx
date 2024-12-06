import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import {
    iGoodsItemProps,
    iImportOrderDetailProps,
    iImportReceiptProps,
} from "~/views/types";
import ReceiptDetailTableRow from "./ReceiptDetailTableRow";
import { iModalTypes } from "../../Modal/types";

function ReceiptDetailTable(props: {
    goods: iGoodsItemProps[];
    listData: iImportOrderDetailProps[];
    setFormData: Dispatch<SetStateAction<iImportReceiptProps>>;
    modalType: iModalTypes;
}) {
    const { listData, modalType } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên hàng</th>
                    <th>ĐVT</th>
                    <th>SL</th>
                    <th>Tầng</th>
                    <th>Kệ</th>
                    {modalType.type === "create" && <th>Xác nhận</th>}
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <ReceiptDetailTableRow
                              key={item.idGoods}
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

export default memo(ReceiptDetailTable);
