import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iModalTypes } from "../../Modal/types";
import GoodsTypeTableRow from "./GoodsTypeTableRow";
import { iGoodsTypeProps } from "~/views/types";

function GoodsTypeTable(props: {
    listData: iGoodsTypeProps[];
    setListData: Dispatch<SetStateAction<iGoodsTypeProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iGoodsTypeProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên loại hàng</th>
                    <th>Tên nhóm hàng</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <GoodsTypeTableRow
                            key={item.idGoodsTypes}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(GoodsTypeTable);
