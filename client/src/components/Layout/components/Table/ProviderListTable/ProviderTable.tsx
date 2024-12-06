import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iModalTypes } from "../../Modal/types";
import ProviderTableRow from "./ProviderTableRow";
import { iProviderProps } from "~/views/types";

function GoodsGroupTable(props: {
    listData: iProviderProps[];
    setListData: Dispatch<SetStateAction<iProviderProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iProviderProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên nhà cung cấp</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <ProviderTableRow
                            key={item.idProviders}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(GoodsGroupTable);
