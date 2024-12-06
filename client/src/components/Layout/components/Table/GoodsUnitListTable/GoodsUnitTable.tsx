import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iGoodsUnitProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import GoodsUnitTableRow from "./GoodsUnitTableRow";

function GoodsUnitTable(props: {
    listData: iGoodsUnitProps[];
    setListData: Dispatch<SetStateAction<iGoodsUnitProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iGoodsUnitProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên đơn vị tính</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <GoodsUnitTableRow
                            key={item.idGoodsUnits}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(GoodsUnitTable);
