import {
    Dispatch,
    MouseEventHandler,
    SetStateAction,
    memo,
    useCallback,
} from "react";
import { Button, Form } from "react-bootstrap";
import { QR_API_ROOT } from "~/constants";
import {
    iGoodsItemProps,
    iImportOrderDetailProps,
    iImportOrderProps,
} from "~/views/types";

function OrderDetailTableRow(props: {
    formData: iImportOrderProps;
    goods: iGoodsItemProps[];
    item: iImportOrderDetailProps;
    setListData: Dispatch<SetStateAction<iImportOrderDetailProps[]>>;
    index: number;
    setFormData: Dispatch<React.SetStateAction<iImportOrderProps>>;
}) {
    const { item, setListData, index, setFormData, formData, goods } = props;

    const good = goods.find((good) => good.idGoods === item.idGoods);

    const handleDelete = useCallback(() => {
        const newDetails = [...formData.importOrderDetails];
        newDetails.splice(index, 1);
        setFormData((prev) => {
            return {
                ...prev,
                importOrderDetails: newDetails,
            };
        });
    }, [index, item, setListData]);

    const handlePrintORCode: MouseEventHandler<HTMLTableRowElement> = async (
        e
    ) => {
        e.stopPropagation();
        const data = encodeURIComponent(
            JSON.stringify({
                idImportOrder: formData.idImportOrders,
                idGoods: good?.idGoods,
                name: good?.name,
                amount: item.amount,
            })
        );
        const newWindow = window.open(
            "",
            "_blank",
            "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status=0"
        );
        if (newWindow) {
            newWindow?.document.write(
                `<img src="${QR_API_ROOT}&data=${data}" />`
            );
            newWindow.document.title = `ID đơn: ${formData.idImportOrders} - ID hàng:${item?.idGoods} - SL:${item?.amount}`;
            const img = newWindow?.document.querySelector("img");
            if (img) {
                img.onload = () => {
                    newWindow.print();
                    newWindow.close();
                };
            }
        }
    };

    return (
        <tr
            style={{
                cursor: "pointer",
            }}
            onClick={formData.status === 3 ? handlePrintORCode : () => {}}
        >
            <td>{item.idGoods}</td>
            <td>{good?.name}</td>
            <td>{good?.idUnit2?.name}</td>
            <td className="d-flex justify-content-between align-items-center">
                {item.amount}
                {formData.status === 0 && (
                    <>
                        &nbsp;
                        <Button
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </Button>
                    </>
                )}
            </td>
            {(formData.status === 2 || formData.status === 3) && (
                <td
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Form.Group>
                        <Form.Control
                            required
                            type="date"
                            readOnly={formData.status === 3}
                            value={item.exp}
                            onChange={(e) => {
                                setFormData((prev) => {
                                    const importDetails = [
                                        ...prev.importOrderDetails,
                                    ];
                                    importDetails.splice(index, 1, {
                                        ...prev.importOrderDetails[index],
                                        exp: e.target.value,
                                    });
                                    return {
                                        ...prev,
                                        importOrderDetails: importDetails,
                                    };
                                });
                            }}
                        />
                    </Form.Group>
                </td>
            )}
        </tr>
    );
}

export default memo(OrderDetailTableRow);
