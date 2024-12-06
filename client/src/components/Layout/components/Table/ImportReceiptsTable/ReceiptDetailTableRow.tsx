import { Dispatch, SetStateAction, memo } from "react";
import { Form } from "react-bootstrap";
import {
    iGoodsItemProps,
    iImportOrderDetailProps,
    iImportReceiptProps,
} from "~/views/types";
import { iModalTypes } from "../../Modal/types";

function ReceiptDetailTableRow(props: {
    goods: iGoodsItemProps[];
    item: iImportOrderDetailProps;
    index: number;
    setFormData: Dispatch<SetStateAction<iImportReceiptProps>>;
    modalType: iModalTypes;
}) {
    const { item, goods, setFormData, index, modalType } = props;

    const good = goods.find((good) => good.idGoods === item.idGoods);

    const handleConfirm = () => {
        //toggle confirm receipt detail
        setFormData((prev) => {
            const currentList = [...prev.idImportOrder2.importOrderDetails];
            currentList.splice(index, 1, {
                ...item,
                checked: !item.checked,
            });
            return {
                ...prev,
                idImportOrder2: {
                    ...prev.idImportOrder2,
                    importOrderDetails: currentList,
                },
            };
        });
    };

    return (
        <tr
            style={{
                cursor: "pointer",
            }}
        >
            <td>{item.idGoods}</td>
            <td>{good?.name}</td>
            <td>{good?.idUnit2?.name}</td>
            <td className="d-flex justify-content-between align-items-center">
                {item.amount}
            </td>
            <td>{good?.floor}</td>
            <td>{good?.slot}</td>
            {modalType.type === "create" && (
                <td>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            required
                            checked={item.checked}
                            onChange={handleConfirm}
                        ></Form.Check>
                        <Form.Control.Feedback type="invalid">
                            Bắt buộc chọn
                        </Form.Control.Feedback>
                    </Form.Group>
                </td>
            )}
        </tr>
    );
}

export default memo(ReceiptDetailTableRow);
