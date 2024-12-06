import { Dispatch, SetStateAction, memo } from "react";
import { Form } from "react-bootstrap";
import {
    iExportDetailProps,
    iExportReceiptProps,
    iGoodsItemProps,
    iStocktakingDetail,
    iStocktakingReceiptProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";

function StocktakingReceiptDetailTableRow(props: {
    goods: iGoodsItemProps[];
    item: iStocktakingDetail;
    index: number;
    setFormData: Dispatch<SetStateAction<iStocktakingReceiptProps>>;
    modalType: iModalTypes;
}) {
    const { item, goods } = props;

    const good = goods.find((good) => good.idGoods === item.idGoods);

    return (
        <tr
            style={{
                cursor: "pointer",
            }}
        >
            <td>{item.idGoods}</td>
            <td>{good?.name}</td>
            <td>{item.amount}</td>
            <td className="d-flex justify-content-between align-items-center">
                {item.storedAmount}
            </td>
            <td>{item.quality}</td>
            <td>{item.solution}</td>
        </tr>
    );
}

export default memo(StocktakingReceiptDetailTableRow);
