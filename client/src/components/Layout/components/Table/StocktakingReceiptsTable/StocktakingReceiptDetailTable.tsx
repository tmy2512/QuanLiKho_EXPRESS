import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import {
    iStocktakingDetail,
    iExportReceiptProps,
    iGoodsItemProps,
    iStocktakingReceiptProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import StocktakingReceiptDetailTableRow from "./StocktakingReceiptDetailTableRow";

function StocktakingReceiptDetailTable(props: {
    goods: iGoodsItemProps[];
    listData: iStocktakingDetail[];
    setFormData: Dispatch<SetStateAction<iStocktakingReceiptProps>>;
    modalType: iModalTypes;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên hàng</th>
                    <th>SL kiểm kê</th>
                    <th>SL tồn</th>
                    <th>Chất lượng</th>
                    <th>Hướng xử lý</th>
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <StocktakingReceiptDetailTableRow
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

export default memo(StocktakingReceiptDetailTable);
