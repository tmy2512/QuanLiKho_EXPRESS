import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import {
    iStocktakingReceiptProps,
    iStocktakingReceiptItemProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import StocktakingReceiptTableRow from "./StocktakingReceiptsTableRow";

function StocktakingReceiptTable(props: {
    listData: iStocktakingReceiptItemProps[];
    setListData: Dispatch<SetStateAction<iStocktakingReceiptItemProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iStocktakingReceiptProps>>;
}) {
    const { listData } = props;
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID phiếu kiểm kê</th>
                    <th>Kho kiểm kê</th>
                    <th>Ngày kiểm kê</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <StocktakingReceiptTableRow
                            key={item.idStocktakingReceipts}
                            item={item}
                            index={index}
                            {...props}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(StocktakingReceiptTable);
