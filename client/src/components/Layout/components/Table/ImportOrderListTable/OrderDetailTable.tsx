import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import {
    iGoodsItemProps,
    iImportOrderDetailProps,
    iImportOrderProps,
} from "~/views/types";
import OrderDetailTableRow from "./OrderDetailTableRow";
import { iModalTypes } from "../../Modal/types";

function OrderDetailTable(props: {
    goods: iGoodsItemProps[];
    formData: iImportOrderProps;
    listData: iImportOrderDetailProps[];
    modalType: iModalTypes;
    setListData: Dispatch<SetStateAction<iImportOrderDetailProps[]>>;
    setFormData: Dispatch<React.SetStateAction<iImportOrderProps>>;
}) {
    const { listData, formData } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID hàng</th>
                    <th>Tên hàng</th>
                    <th>ĐVT</th>
                    <th>SL</th>
                    {(formData.status === 2 || formData.status === 3) && (
                        <th>Hạn sử dụng</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {listData.length
                    ? listData.map((item, index) => (
                          <OrderDetailTableRow
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

export default memo(OrderDetailTable);
