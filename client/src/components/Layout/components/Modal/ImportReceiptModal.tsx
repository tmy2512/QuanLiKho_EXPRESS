import {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormLabel,
  Modal,
  Row,
} from "react-bootstrap";
import { getAllGoods, modifyGoods } from "~/apis/goodsAPI";
import { getAllImportOrderByStatus } from "~/apis/importOrderAPI";
import {
  createImportReceipt,
  softDeleteImportReceipt,
} from "~/apis/importReceiptAPI";
import { getAllWarehouses } from "~/apis/warehouseAPI";
import { getCookie } from "~/utils/cookies";
import stringToDate from "~/utils/stringToDate";
import { initImportOrderData } from "~/views/ImportOrderView/ImportOrderView";
import { initImportReceipt } from "~/views/ImportReceiptView/ImportReceiptView";
import {
  iGoodsItemProps,
  iImportOrderDetailProps,
  iImportOrderProps,
  iImportReceiptItemProps,
  iImportReceiptProps,
  iWarehouseItemProps,
} from "~/views/types";
import ReceiptDetailTable from "../Table/ImportReceiptsTable/ReceiptDetailTable";
import { iModalTypes } from "./types";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function ImportReceiptModal(props: {
  show: true | false;
  onHide: () => void;
  listData: iImportReceiptItemProps[];
  setListData: Dispatch<SetStateAction<iImportReceiptItemProps[]>>;
  modalType: iModalTypes;
  formData: iImportReceiptProps;
  setFormData: Dispatch<React.SetStateAction<iImportReceiptProps>>;
}) {
  const {
    show,
    onHide,
    listData,
    setListData,
    modalType,
    formData,
    setFormData,
  } = props;
  const [validated, setValidated] = useState(false);
  const importDateRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  let title: string;
  const [goods, setGoods] = useState<iGoodsItemProps[]>([]);
  const [warehouses, setWarehouses] = useState<iWarehouseItemProps[]>([]);
  const [importOrders, setImportOrders] = useState<iImportOrderProps[]>([]);
  const [currentOrder, setCurrentOrder] =
    useState<iImportOrderProps>(initImportOrderData);
  const role = useRole();

  switch (modalType.type) {
    case "create":
      title = "Thêm mới";
      break;
    case "update":
      title = "Xem thông tin";
      break;
  }

  useEffect(() => {
    getAllImportOrderByStatus(1).then((data) => {
      if (!data || !data.length || !listData.length) return;
      const ordersWithoutReceipt = [];
      //filter orders have been imported
      for (const order of data) {
        let hasReceipt = false;

        for (const receipt of listData) {
          if (order.idImportOrders === receipt.idImportOrder) {
            hasReceipt = true;
            break;
          }
        }

        if (!hasReceipt) {
          ordersWithoutReceipt.push(order);
        }
      }
      setImportOrders(ordersWithoutReceipt);
    });
    getAllGoods().then((data) => data && setGoods(data));
    getAllWarehouses().then((data) => data && setWarehouses(data));
  }, [listData]);

  const handleChangeReceiptInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case "idImportOrder":
        {
          const order = importOrders.find(
            (order) => order.idImportOrders === +value
          );
          if (order) {
            setCurrentOrder(order);
            setFormData((prev) => ({
              ...prev,
              idImportOrder: order.idImportOrders,
              idImportOrder2: {
                ...order,
              },
              idWarehouse: 4,
              idProvider: order.idProvider,
            }));
          }
        }
        break;
      default:
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  };
  // const handleUpdateListData = (data: iImportOrderDetailProps) => {
  //     const newListData = formData.idImportOrder2.importOrderDetails.map(
  //         (detail) => {
  //             if (
  //                 detail.idImportOrder === data.idImportOrder &&
  //                 detail.idGoods === data.idGoods &&
  //                 detail.amount === data.amount
  //             ) {
  //                 detail.checked = true;
  //             }
  //             return detail;
  //         }
  //     );
  //     setFormData((prev) => {
  //         return {
  //             ...prev,
  //             idImportOrder2: {
  //                 ...formData.idImportOrder2,
  //                 importOrderDetails: newListData,
  //             },
  //         };
  //     });
  // };

  const customValidateDate = () => {
    const importDate = importDateRef.current;
    const exp = expRef.current;

    //validate startDate <= now
    if (importDate && importDate.value.length > 0) {
      const date = new Date(importDate.value);
      const now = new Date(Date.now());

      if (date > now) {
        importDate.setCustomValidity(
          "Ngày nhập kho không thể trong tương lai"
        );
        importDate.reportValidity();
        return false;
      } else {
        importDate.setCustomValidity("");
        importDate.reportValidity();
      }
    }

    if (exp && exp.value.length > 0) {
      const date = new Date(exp.value);
      const now = new Date(Date.now());

      if (date <= now) {
        exp.setCustomValidity("Ngày hết hạn không thể trong quá khứ");
        exp.reportValidity();
        return false;
      } else {
        exp.setCustomValidity("");
        exp.reportValidity();
      }
    }
    return true;
  };

  const validateForm = () => {
    const form = formRef.current;
    const idCreated = getCookie("id");
    formData.importDate = new Date().toString();
    formData.idWarehouse = +formData.idWarehouse;
    formData.idUserImport = +idCreated;
    formData.idUpdated = +idCreated;

    if (
      (form && form.checkValidity() === false) ||
      customValidateDate() === false
    ) {
      setValidated(true);
      return false;
    }

    return true;
  };

  const handleSubmitCreate: FormEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const isValidated = validateForm();
      e.preventDefault();
      e.stopPropagation();

      //call API
      if (isValidated) {
        const goodsArray =
          formData.idImportOrder2.importOrderDetails.map(
            (goodsItem) => {
              return {
                id: goodsItem.idGoods,
                amount: goodsItem.amount,
                exp: goodsItem.exp,
                importDate: new Date().toISOString(),
              };
            }
          );
        modifyGoods(goodsArray).then(() =>
          createImportReceipt(formData)
            .then((data) => {
              data && setListData((prev) => [data, ...prev]);
              if (!data.error) {
                handleCancel();
              }
            })
            .catch((error) => console.log(error))
        );
      }
    },
    [formData, setListData]
  );

  const handleSoftDelete = () => {
    const message = `Bạn có chắc muốn huỷ phiếu nhập kho mã số "${formData.idImportReceipts}"?`;
    const deleteConfirm = window.confirm(message);
    if (deleteConfirm) {
      softDeleteImportReceipt(formData.idImportReceipts).then(() => {
        listData.forEach((data, index) => {
          if (data.idImportReceipts === formData.idImportReceipts) {
            const newData = [...listData];
            newData.splice(index, 1);
            setListData(newData);
          }
        });
      });
      handleCancel();
    }
  };

  const handleSubmitUpdate: FormEventHandler<HTMLButtonElement> = (e) => {
    const isValidated = validateForm();
    e.preventDefault();
    e.stopPropagation();
    if (!isValidated) return;

    // updateImportOrder(formData).then(() => {
    //     listData.forEach((data, index) => {
    //         if (data.idImportOrders === formData.idImportOrders) {
    //             //deep clone
    //             const newData = [...listData];
    //             newData.splice(index, 1, formData);
    //             setListData(newData);
    //         }
    //     });
    // });
    handleCancel();
  };

  const handleCancel = () => {
    setCurrentOrder(initImportOrderData);
    setFormData(initImportReceipt);
    setValidated(false);
    onHide();
  };
  console.log(importOrders);

  return (
    <Modal
      backdrop={modalType.type === "create" ? "static" : undefined}
      show={show}
      onHide={handleCancel}
      keyboard={false}
      fullscreen={formData.status < 3 ? true : undefined}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${title} phiếu nhập kho`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
        >
          <Row className="mb-3">
            <Col lg={6}>
              <Form.Group className="mb-3">
                {modalType.type === "create" ? (
                  <>
                    <FormLabel>
                      Đơn nhập kho &nbsp;
                    </FormLabel>
                    <Form.Select
                      required
                      name="idImportOrder"
                      value={formData.idImportOrder}
                      onChange={handleChangeReceiptInput}
                    >
                      <option value={0}>
                        ------Chọn đơn nhập kho------
                      </option>
                      {importOrders.length &&
                        importOrders.map((order) => (
                          <option
                            key={
                              order.idImportOrders
                            }
                            value={
                              order.idImportOrders
                            }
                          >
                            ID:{" "}
                            {order.idImportOrders} -{" "}
                            NCC:{" "}
                            {
                              order.idProvider2
                                ?.name
                            }
                            - Ngày đặt:{" "}
                            {stringToDate(
                              order.orderDate
                            )}{" "}
                            - SL:{" "}
                            {
                              order
                                .importOrderDetails
                                .length
                            }
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Text muted>
                      Chỉ những đơn đã hoàn thành mới có
                      thể nhập kho
                    </Form.Text>
                  </>
                ) : (
                  <>
                    <FormLabel>Đơn nhập kho</FormLabel>
                    <Form.Control
                      value={`ID: ${formData.idImportOrder
                        } - NCC:  ${formData.idProvider2?.name
                        }- Ngày đặt: ${stringToDate(
                          formData.idImportOrder2
                            .orderDate
                        )} - SL: ${formData.idImportOrder2
                          .importOrderDetails.length
                        }`}
                      readOnly
                    ></Form.Control>
                  </>
                )}
                <Form.Control.Feedback type="invalid">
                  Bắt buộc chọn
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nhà cung cấp</Form.Label>
                {modalType.type === "create" ? (
                  <Form.Control
                    name="idProvider"
                    placeholder="NCC sẽ hiển thị theo đơn nhập kho"
                    value={
                      currentOrder.idProvider2
                        ? `${currentOrder.idProvider2?.name} - Đ/c: ${currentOrder.idProvider2?.address}`
                        : ""
                    }
                    readOnly
                  ></Form.Control>
                ) : (
                  <Form.Control
                    name="idProvider"
                    placeholder="NCC sẽ hiển thị theo đơn nhập kho"
                    value={
                      formData.idProvider2
                        ? `${formData.idProvider2?.name} - Đ/c: ${formData.idProvider2?.address}`
                        : ""
                    }
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kho nhập</Form.Label>
                {modalType.type === "create" ? (
                  <>
                    <Form.Select
                      name="idWarehouse"
                      value={formData.idWarehouse}
                      onChange={handleChangeReceiptInput}
                      required
                    >
                      <option value="">
                        ------Chọn kho nhập------
                      </option>
                      {warehouses.length &&
                        warehouses.map((item) => (
                          <option
                            key={item.idWarehouse}
                            value={item.idWarehouse}
                          >
                            {item.name} - Đ/c:{" "}
                            {item.address}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Bắt buộc chọn
                    </Form.Control.Feedback>
                  </>
                ) : (
                  <Form.Control
                    name="idWarehouse"
                    value={`${formData.idWarehouse2?.name} - Đ/c: ${formData.idWarehouse2?.address}`}
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              <hr />
            </Col>

            <Col lg={6}>
              <h4>Chi tiết phiếu nhập</h4>
              <ReceiptDetailTable
                goods={goods}
                listData={
                  formData.idImportOrder2.importOrderDetails
                }
                setFormData={setFormData}
                modalType={modalType}
              />
              <Form.Text muted>
                Mặt hàng và số lượng sẽ tuân theo đơn nhập kho
                <br />
                Vui lòng kiểm đếm kỹ và tích vào các chi tiết
                phiếu!
              </Form.Text>
            </Col>
          </Row>
          {modalType.type === "create" && (
            <>
              <Form.Group className="mb-3">
                <Form.Check
                  required
                  label="Đã kiểm tra kỹ thông tin"
                  feedback="Vui lòng đánh dấu checkbox này để gửi thông tin!"
                  feedbackType="invalid"
                />
              </Form.Group>
              <Alert variant="info">
                Vui lòng kiểm tra kỹ thông tin!
              </Alert>
            </>
          )}
          {modalType.type === "update" && (
            <>
              <Form.Text>
                {`Tạo lúc ${formData.importDate &&
                  stringToDate(
                    formData.importDate?.toString()
                  )
                  } bởi ${formData.usernameCreated}`}
              </Form.Text>
              <br />
              {formData.usernameUpdated && (
                <Form.Text>
                  {`Sửa đổi lần cuối lúc ${formData.updatedAt &&
                    stringToDate(
                      formData.updatedAt?.toString()
                    )
                    } bởi ${formData.usernameUpdated}`}
                </Form.Text>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="reset" onClick={handleCancel}>
          {modalType.type === "update" ? "Đóng" : "Huỷ"}
        </Button>
        {modalType.type === "create" ? (
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmitCreate}
          >
            Nhập kho
          </Button>
        ) : (
          formData.status === 0 &&
          (role === ROLE_ID.DIRECTOR_2 || role === ROLE_ID.CEO_6) && (
            <Button variant="dark" onClick={handleSoftDelete}>
              Huỷ phiếu
            </Button>
          )
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default memo(ImportReceiptModal);
