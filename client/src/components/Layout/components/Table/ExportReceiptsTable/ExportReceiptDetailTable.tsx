import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import {
    iExportDetailProps,
    iExportReceiptProps,
    iGoodsItemProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import ExportReceiptDetailTableRow from "./ExportReceiptDetailTableRow";

function ExportReceiptDetailTable(props: {
    goods: iGoodsItemProps[];
    listData: iExportDetailProps[];
    setFormData: Dispatch<SetStateAction<iExportReceiptProps>>;
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
                    {modalType.type === "create" && <th>Đã lấy hàng</th>}
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <ExportReceiptDetailTableRow
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

export default memo(ExportReceiptDetailTable);
