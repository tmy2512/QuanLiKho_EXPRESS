import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iGoodsItemProps, iGoodsProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import GoodsTableRow from "./GoodsTableRow";

function GoodsTable(props: {
    listData: iGoodsItemProps[];
    setListData: Dispatch<SetStateAction<iGoodsItemProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iGoodsProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover responsive="md">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên hàng</th>
                    <th>SL tồn</th>
                    <th>Hạn sử dụng</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <GoodsTableRow
                            key={item.idGoods}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(GoodsTable);
