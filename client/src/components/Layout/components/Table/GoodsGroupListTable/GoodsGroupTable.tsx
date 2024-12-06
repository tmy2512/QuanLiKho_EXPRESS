import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iGoodsGroupProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import GoodsGroupTableRow from "./GoodsGroupTableRow";

function GoodsGroupTable(props: {
    listData: iGoodsGroupProps[];
    setListData: Dispatch<SetStateAction<iGoodsGroupProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iGoodsGroupProps>>;
}) {
    const {
        listData,
        setListData,
        toggleShowModal,
        setModalType,
        setFormData,
    } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên nhóm hàng</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <GoodsGroupTableRow
                            key={item.idGoodsGroups}
                            item={item}
                            index={index}
                            setListData={setListData}
                            toggleShowModal={toggleShowModal}
                            setModalType={setModalType}
                            setFormData={setFormData}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(GoodsGroupTable);
