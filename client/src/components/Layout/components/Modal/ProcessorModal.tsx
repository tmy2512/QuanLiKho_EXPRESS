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
  Badge,
  Button,
  Col,
  Form,
  FormLabel,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import {
  getAllExportReceiptByStatus,
  updateExportReceipt,
} from "~/apis/exportReceiptAPI";
import { getCookie } from "~/utils/cookies";
import stringToDate from "~/utils/stringToDate";
import { initExportReceipt } from "~/views/ExportReceiptView/ExportReceiptView";
import { iExportReceiptItemProps, iExportReceiptProps } from "~/views/types";
import QRCodeScanner from "../QRCodeScanner/QRCodeScanner";
import { iModalTypes, iPrintExportReceipt } from "./types";
import { QR_API_ROOT } from "~/constants";

function ProcessorModal(props: {
  show: true | false;
  onHide: () => void;
  tabKey: "packed" | "classified" | string;
  listData: iExportReceiptItemProps[];
  setListData: Dispatch<SetStateAction<iExportReceiptItemProps[]>>;
  modalType: iModalTypes;
  formData: iExportReceiptProps;
  setFormData: Dispatch<React.SetStateAction<iExportReceiptProps>>;
}) {
  const {
    show,
    onHide,
    listData,
    setListData,
    modalType,
    formData,
    setFormData,
    tabKey,
  } = props;
  const [validated, setValidated] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [processingOrders, setProcessingOrders] = useState<
    iExportReceiptItemProps[]
  >([]);

  const qrObject: iPrintExportReceipt = {
    idExportReceipts: formData.idExportReceipts,
    idExportOrder: formData.idExportOrder,
  };
  const qrData = encodeURIComponent(JSON.stringify(qrObject));

  useEffect(() => {
    const statusCode = tabKey === "packed" ? 0 : 1;
    getAllExportReceiptByStatus(statusCode).then((data) =>
      data && setProcessingOrders(data)
    );
  }, [tabKey, listData]);

  let title: string;
  const process = tabKey === "packed" ? " đóng gói " : " phân loại ";
  switch (modalType.type) {
    case "create":
      title = "Xác nhận";
      break;
    case "update":
      title = "Xem thông tin";
      break;
  }

  const handleChangeReceiptInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { value } = e.target;
    const idExportOrder = processingOrders.find(
      (receipt) => receipt.idExportReceipts === +value
    )?.idExportOrder2.idExportOrders;

    if (idExportOrder) {
      setFormData((prev) => {
        return {
          ...prev,
          idExportReceipts: +value,
          idExportOrder: idExportOrder,
        };
      });
    } else setFormData(initExportReceipt);
  };

  const validateForm = () => {
    const form = formRef.current;
    formData.idExportOrder = +formData.idExportOrder;
    formData.idExportReceipts = +formData.idExportReceipts;

    if (form && form.checkValidity() === false) {
      setValidated(true);
      return false;
    }

    return true;
  };

  const handleUpdateListData = (data: iExportReceiptProps) => {
    setFormData(data);
  };

  const handleSubmit: FormEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const isValidated = validateForm();
      const idUpdated = +getCookie("id");
      e.preventDefault();
      e.stopPropagation();

      const submitType = tabKey === "packed" ? 1 : 2;

      //call API
      if (isValidated) {
        updateExportReceipt(
          formData.idExportReceipts,
          submitType,
          idUpdated
        )
          .then((data) => {
            data && setListData((prev) => [data, ...prev]);
            if (!data.error) {
              handleCancel();
            }
          })
          .catch((error) => console.log(error));
      }
    },
    [formData, setListData]
  );

  const handleCancel = () => {
    setFormData(initExportReceipt);
    setValidated(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleCancel();
        onHide();
      }}
      fullscreen={"sm-down"}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${title} ${process}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
        >
          <Row className="mb-3">
            {modalType.type === "create" && (
              <Form.Group>
                <QRCodeScanner
                  show={show}
                  handleUpdateListData={handleUpdateListData}
                />
              </Form.Group>
            )}
            <Form.Group className="mt-3">
              {modalType.type === "create" ? (
                <>
                  <FormLabel>
                    Mã phiếu xuất kho (chọn thủ công nếu
                    không quét được mã QR) &nbsp;
                  </FormLabel>
                  <Form.Select
                    required
                    name="idExportReceipts"
                    value={formData.idExportReceipts}
                    onChange={handleChangeReceiptInput}
                  >
                    <option value={0}>
                      ----Chọn phiếu xuất kho----
                    </option>
                    {processingOrders.length > 0 &&
                      processingOrders.map((order) => (
                        <option
                          key={order.idExportReceipts}
                          value={
                            order.idExportReceipts
                          }
                        >
                          ID phiếu xuất:{" "}
                          {order?.idExportReceipts} -
                          ID đơn xuất:{" "}
                          {
                            order?.idExportOrder2
                              .idExportOrders
                          }
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Text muted>
                    {tabKey === "packed"
                      ? "Chỉ những phiếu đã xuất kho mới có thể xử lý"
                      : "Chỉ những đơn đã đóng gói mới có thể phân loại"}
                  </Form.Text>
                </>
              ) : (
                <>
                  <Row>
                    <Form.Group as={Col}>
                      <FormLabel>
                        Mã phiếu xuất - Mã đơn xuất
                      </FormLabel>
                      <Form.Control
                        value={`ID phiếu xuất: ${formData.idExportReceipts} - ID đơn xuất: ${formData.idExportOrder}`}
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <FormLabel>Ngày xuất</FormLabel>
                      <Form.Control
                        value={stringToDate(
                          formData.exportDate
                        )}
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <FormLabel>
                        Mã tỉnh / thành phố
                      </FormLabel>
                      <Form.Control
                        value={
                          formData.idExportOrder2
                            .provinceCode
                        }
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <FormLabel>
                        Mã quận / huyện
                      </FormLabel>
                      <Form.Control
                        value={
                          formData.idExportOrder2
                            .districtCode
                        }
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <FormLabel>
                        Mã xã / phường / thị trấn
                      </FormLabel>
                      <Form.Control
                        value={
                          formData.idExportOrder2
                            .wardCode
                        }
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <FormLabel>Kho xuất</FormLabel>
                      <Form.Control
                        value={`${formData.idWarehouse2?.name} - Đ/c: ${formData.idWarehouse2?.address}`}
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                  </Row>
                  <Row>
                    {formData.usernameUpdated && (
                      <Form.Text>
                        {`Sửa đổi lần cuối lúc ${formData.updatedAt &&
                          stringToDate(
                            formData.updatedAt?.toString()
                          )
                          } bởi ${formData.usernameUpdated
                          }`}
                      </Form.Text>
                    )}
                    <br />
                    <Form.Text>
                      Trạng thái:{" "}
                      <Badge
                        bg={
                          formData.status === 1
                            ? "primary"
                            : "info"
                        }
                      >
                        {formData.status === 1
                          ? "Đã đóng gói"
                          : "Đã phân loại"}
                      </Badge>
                    </Form.Text>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <FormLabel>
                        Mã QR gói hàng
                      </FormLabel>
                      <br />
                      <Form.Text muted>
                        Mã QR được dán trên gói hàng
                      </Form.Text>
                      <br />
                      <Image
                        src={`${QR_API_ROOT}&data=${qrData}`}
                      />
                    </Form.Group>
                  </Row>
                </>
              )}
              <Form.Control.Feedback type="invalid">
                Bắt buộc chọn
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          type="reset"
          onClick={() => {
            handleCancel();
            onHide();
          }}
        >
          Đóng
        </Button>
        {modalType.type === "create" ? (
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Xác nhận {process}
          </Button>
        ) : (
          <></>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default memo(ProcessorModal);
