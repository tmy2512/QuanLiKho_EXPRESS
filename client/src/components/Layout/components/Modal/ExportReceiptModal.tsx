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
  Accordion,
  Alert,
  Button,
  Col,
  Form,
  FormLabel,
  Modal,
  Row,
} from "react-bootstrap";
import { getAllExportOrders } from "~/apis/exportOrderAPI";
import {
  createExportReceipt,
  softDeleteExportReceipt,
} from "~/apis/exportReceiptAPI";
import { getAllGoods, modifyGoods } from "~/apis/goodsAPI";
import { getAllWarehouses } from "~/apis/warehouseAPI";
import { getCookie } from "~/utils/cookies";
import stringToDate from "~/utils/stringToDate";
import {
  initExportOrder,
  initExportReceipt,
} from "~/views/ExportReceiptView/ExportReceiptView";
import {
  iExportDetailProps,
  iExportOrderProps,
  iExportReceiptItemProps,
  iExportReceiptProps,
  iGoodsItemProps,
  iWarehouseItemProps,
} from "~/views/types";
import QRCodeScanner from "../QRCodeScanner/QRCodeScanner";
import ExportReceiptDetailTable from "../Table/ExportReceiptsTable/ExportReceiptDetailTable";
import { iModalTypes, iPrintExportReceipt } from "./types";
import { QR_API_ROOT } from "~/constants";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

function ExportReceiptModal(props: {
  show: true | false;
  onHide: () => void;
  listData: iExportReceiptItemProps[];
  setListData: Dispatch<SetStateAction<iExportReceiptItemProps[]>>;
  modalType: iModalTypes;
  formData: iExportReceiptProps;
  setFormData: Dispatch<React.SetStateAction<iExportReceiptProps>>;
  toggleCreateOrder: boolean;
}) {
  const {
    show,
    onHide,
    listData,
    setListData,
    modalType,
    formData,
    setFormData,
    toggleCreateOrder,
  } = props;
  const [validated, setValidated] = useState(false);
  const importDateRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  let title: string;
  const [goods, setGoods] = useState<iGoodsItemProps[]>([]);
  const [warehouses, setWarehouses] = useState<iWarehouseItemProps[]>([]);
  const [exportOrders, setExportOrders] = useState<iExportOrderProps[]>([]);
  const [currentOrder, setCurrentOrder] =
    useState<iExportOrderProps>(initExportOrder);
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
    getAllGoods().then((data) => data && setGoods(data));
    getAllWarehouses().then((data) => data && setWarehouses(data));
  }, [listData]);

  useEffect(() => {
    getAllExportOrders().then((data) => {
      const ordersWithoutReceipt = [];
      if (data === undefined || listData === undefined) {
        return;
      }
      //filter orders have been imported
      for (const order of data) {
        let hasReceipt = false;

        for (const receipt of listData) {
          if (
            order.idExportOrders ===
            receipt.idExportOrder2.idExportOrders
          ) {
            hasReceipt = true;
            break;
          }
        }
        if (!hasReceipt) {
          ordersWithoutReceipt.push(order);
        }
      }
      setExportOrders(ordersWithoutReceipt);
    });
  }, [listData, toggleCreateOrder]);

  const handleChangeReceiptInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case "idExportOrder":
        {
          const order = exportOrders.find(
            (order) => order.idExportOrders === +value
          );
          const idWarehouse =
            order?.exportOrderDetails[0].idGoods2?.idWarehouse;
          if (order) {
            setCurrentOrder(order);
            if (order.idExportOrders) {
              setFormData((prev) => {
                return {
                  ...prev,
                  idExportOrder: order.idExportOrders || 0,
                  idExportOrder2: order,
                  idWarehouse: idWarehouse || 0,
                };
              });
            }
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
  const handleUpdateListData = (data: iExportDetailProps) => {
    const newListData = formData.idExportOrder2.exportOrderDetails.map(
      (detail) => {
        if (detail.idGoods === data.idGoods && !detail.checked) {
          detail.checked = true;
        }
        return detail;
      }
    );
    setFormData((prev) => {
      return {
        ...prev,
        idExportOrder2: {
          ...formData.idExportOrder2,
          exportOrderDetails: newListData,
        },
      };
    });
  };

  const customValidateDate = () => {
    const importDate = importDateRef.current;
    const exp = expRef.current;

    //validate startDate <= now
    if (importDate && importDate.value.length > 0) {
      const date = new Date(importDate.value);
      const now = new Date(Date.now());

      if (date > now) {
        importDate.setCustomValidity(
          "Ngày xuất kho không thể trong tương lai"
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
    formData.exportDate = new Date().toString();
    formData.idWarehouse = +formData.idWarehouse;
    formData.idUserExport = +idCreated;
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
    async (e) => {
      const isValidated = validateForm();
      e.preventDefault();
      e.stopPropagation();

      //call API
      if (isValidated) {
        const goodsArray =
          formData.idExportOrder2.exportOrderDetails.map(
            (goodsItem) => {
              return {
                id: goodsItem.idGoods,
                amount: -goodsItem.amount,
              };
            }
          );

        try {
          const res = await modifyGoods(goodsArray);
          if (res?.ok) {
            const data = await createExportReceipt(formData);
            data && setListData((prev) => [data, ...prev]);
            if (!data.error) {
              handleCancel();
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [formData, setListData]
  );

  const handleSoftDelete = () => {
    const message = `Nhập lý do huỷ phiếu xuất kho mã số "${formData.idExportReceipts}"?`;
    const reasonFailed = window.prompt(message)?.trim();
    if (reasonFailed) {
      softDeleteExportReceipt(
        formData.idExportReceipts,
        reasonFailed
      ).then(() => {
        listData.forEach((data, index) => {
          if (data.idExportReceipts === formData.idExportReceipts) {
            const newData = [...listData];
            newData.splice(index, 1);
            setListData(newData);
          }
        });
      });
      handleCancel();
    }
  };

  const handleCancel = () => {
    setCurrentOrder(initExportOrder);
    setFormData(initExportReceipt);
    setValidated(false);
    onHide();
  };

  const handlePrintORCode = () => {
    const printData: iPrintExportReceipt = {
      idExportReceipts: formData.idExportReceipts,
      idExportOrder: formData.idExportOrder,
    };
    const data = encodeURIComponent(JSON.stringify(printData));
    const newWindow = window.open(
      "",
      "_blank",
      "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status=0"
    );
    if (newWindow) {
      newWindow?.document.write(
        `<img src="${QR_API_ROOT}&data=${data}" />`
      );
      newWindow.document.write(
        `<br/>
                    <div style="margin-left:35px;margin-top:8px;margin-bottom:8px"
                    >
                        <img src="https://deo.shopeemobile.com/shopee/shopee-spx-live-vn/static/media/spx-express.f3023639.svg" />
                    </div>
                    `
      );
      newWindow.document.title = `ID phiếu: ${formData.idExportReceipts} - ID đơn:${formData.idExportOrder}`;
      newWindow.document.write(
        `ID phiếu: ${formData.idExportReceipts} - ID đơn:${formData.idExportOrder}`
      );
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
    <Modal
      backdrop={modalType.type === "create" ? "static" : undefined}
      show={show}
      onHide={handleCancel}
      keyboard={false}
      fullscreen={formData.status < 3 ? true : undefined}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="mb-2">{`${title} phiếu xuất kho `}</span>
          {modalType.type === "update" && formData.status === 0 && (
            <>
              &nbsp;
              <Button onClick={handlePrintORCode}>
                <i className="fa-solid fa-qrcode"></i> &nbsp; In
                mã QR phiếu
              </Button>
            </>
          )}
        </Modal.Title>
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
                      Đơn xuất kho &nbsp;
                    </FormLabel>
                    <Form.Select
                      required
                      name="idExportOrder"
                      value={formData.idExportOrder}
                      onChange={handleChangeReceiptInput}
                    >
                      <option value="">
                        ------Chọn đơn xuất kho------
                      </option>
                      {exportOrders.length > 0 &&
                        exportOrders.map((order) => (
                          <option
                            key={
                              order?.idExportOrders
                            }
                            value={
                              order?.idExportOrders
                            }
                          >
                            ID:{" "}
                            {order?.idExportOrders}{" "}
                            - Ngày đặt:{" "}
                            {stringToDate(
                              order.orderDate
                            )}{" "}
                            - SL:{" "}
                            {
                              order
                                .exportOrderDetails
                                .length
                            }
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Text muted>
                      Chỉ những đơn đã hoàn thành mới có
                      thể xuất kho
                    </Form.Text>
                  </>
                ) : (
                  <>
                    <FormLabel>Đơn xuất kho</FormLabel>
                    <Form.Control
                      value={`ID: ${formData.idExportOrder
                        } - Ngày đặt: ${stringToDate(
                          formData.idExportOrder2
                            .orderDate
                        )} - SL: ${formData.idExportOrder2
                          .exportOrderDetails.length
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
                <Form.Label>Mã giỏ đựng hàng</Form.Label>
                {modalType.type === "create" ? (
                  <>
                    <Form.Control
                      required
                      name="palletCode"
                      type="number"
                      value={formData.palletCode}
                      onChange={handleChangeReceiptInput}
                      min={1}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Bắt buộc nhập
                    </Form.Control.Feedback>
                  </>
                ) : (
                  <Form.Control
                    name="palletCode"
                    type="number"
                    value={formData.palletCode}
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kho xuất</Form.Label>
                {modalType.type === "create" ? (
                  <>
                    <Form.Select
                      name="idWarehouse"
                      value={formData.idWarehouse}
                      onChange={handleChangeReceiptInput}
                      required
                    >
                      <option value="">
                        ------Chọn kho xuất------
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
              {formData.status === 0 &&
                modalType.type === "create" && (
                  <>
                    <Accordion
                      defaultActiveKey={
                        modalType.type === "create"
                          ? "0"
                          : ""
                      }
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            Xuất kho để đóng gói &
                            phân loại
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Form.Group as={Col} sm="6">
                            {formData.idExportOrder !==
                              0 && (
                                <QRCodeScanner
                                  show={show}
                                  handleUpdateListData={
                                    handleUpdateListData
                                  }
                                />
                              )}
                          </Form.Group>
                          <Form.Text muted>
                            Mặt hàng và số lượng sẽ
                            tuân theo chi tiết phiếu
                            xuất kho
                          </Form.Text>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <hr />
                  </>
                )}
            </Col>

            <Col lg={6}>
              <h4>Chi tiết phiếu xuất</h4>
              <ExportReceiptDetailTable
                goods={goods}
                listData={
                  formData.idExportOrder2.exportOrderDetails
                }
                setFormData={setFormData}
                modalType={modalType}
              />
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
                {`Tạo lúc ${formData.exportDate &&
                  stringToDate(
                    formData.exportDate?.toString()
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
            Xuất kho
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

export default memo(ExportReceiptModal);
