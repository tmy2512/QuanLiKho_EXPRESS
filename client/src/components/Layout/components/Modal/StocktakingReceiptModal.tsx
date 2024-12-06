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
  Badge,
  Button,
  Col,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { getAllGoods } from "~/apis/goodsAPI";
import { getAllWarehouses } from "~/apis/warehouseAPI";
import { STOCKTAKING_DETAIL_KEY } from "~/constants/localStorage";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import { getCookie } from "~/utils/cookies";
import stringToDate from "~/utils/stringToDate";
import { stocktakingInit } from "~/views/StocktakingReceiptView/StocktakingReceiptView";
import {
  iGoodsItemProps,
  iImportOrderDetailProps,
  iStocktakingReceiptItemProps,
  iStocktakingReceiptProps,
  iWarehouseItemProps,
} from "~/views/types";
import QRCodeScanner from "../QRCodeScanner/QRCodeScanner";
import StocktakingReceiptDetailTable from "../Table/StocktakingReceiptsTable/StocktakingReceiptDetailTable";
import { iModalTypes } from "./types";
import { createStocktakingReceipt } from "~/apis/stocktakingReceiptAPI";

interface iStocktakingDetail {
  idGoods: number;
  name: string;
  importDate?: string;
  exp?: string;
  storedAmount: number;
  amount: number;
  floor?: number;
  slot?: number;
  quality: string;
  solution?: string;
}

const initDetail: iStocktakingDetail = {
  idGoods: 0,
  name: "",
  importDate: "",
  exp: "",
  storedAmount: 0,
  amount: 0,
  floor: 0,
  slot: 0,
  quality: "",
};

function StocktakingReceiptModal(props: {
  show: true | false;
  onHide: () => void;
  listData: iStocktakingReceiptItemProps[];
  setListData: Dispatch<SetStateAction<iStocktakingReceiptItemProps[]>>;
  modalType: iModalTypes;
  formData: iStocktakingReceiptProps;
  setFormData: Dispatch<React.SetStateAction<iStocktakingReceiptProps>>;
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
  const [currentDetail, setCurrentDetail] =
    useState<iStocktakingDetail>(initDetail);

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

  const handleChangeReceiptInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case "idGoods":
        const data = goods.find((item) => item.idGoods === +value);
        data &&
          setCurrentDetail({
            storedAmount: data?.amount,
            ...data,
            amount: 0,
            quality: "",
            solution: "",
          });
        break;
      case "amount":
        setCurrentDetail((prev) => {
          return {
            ...prev,
            [name]: +value,
          };
        });

        break;
      case "quality":
      case "solution":
        setCurrentDetail((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });

        break;
      default:
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  };

  const handleUpdateDetailList = (data: iImportOrderDetailProps) => {
    const goodsResult = goods.find((item) => item.idGoods === data.idGoods);
    goodsResult &&
      setCurrentDetail({
        storedAmount: goodsResult?.amount,
        ...goodsResult,
        amount: 0,
        quality: "",
        solution: "",
      });
  };

  const handleAddOrderDetail = () => {
    if (
      currentDetail.idGoods !== 0 &&
      currentDetail.amount &&
      currentDetail.quality
    ) {
      const isExisted = formData.stocktakingDetails.find(
        (detail) => detail.idGoods === currentDetail.idGoods
      );

      if (!isExisted) {
        setFormData((prev) => ({
          ...prev,
          stocktakingDetails: [
            ...prev.stocktakingDetails,
            currentDetail,
          ],
        }));
        sessionStorage.setItem(
          STOCKTAKING_DETAIL_KEY,
          JSON.stringify({
            ...formData,
            stocktakingDetails: [
              ...formData.stocktakingDetails,
              currentDetail,
            ],
          })
        );
        setCurrentDetail(initDetail);
      } else {
        alert("Hàng trùng trong danh sách, không thể thêm!");
      }
    } else {
      alert("Vui lòng thêm thông tin kiểm kê");
    }
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
          "Ngày kiểm kê không thể trong tương lai"
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
    formData.date = new Date().toString();
    formData.idWarehouse = +formData.idWarehouse;
    formData.idUser = +idCreated;
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
        try {
          const data = await createStocktakingReceipt(formData);
          data && setListData((prev) => [data, ...prev]);
          if (!data.error) {
            handleCancel();
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [formData, setListData]
  );

  const handleCancel = () => {
    setCurrentDetail(initDetail);
    setFormData(stocktakingInit);
    sessionStorage.removeItem(STOCKTAKING_DETAIL_KEY);
    setValidated(false);
    onHide();
  };

  return (
    <Modal
      backdrop={modalType.type === "create" ? "static" : undefined}
      show={show}
      onHide={handleCancel}
      keyboard={modalType.type === "create" ? false : true}
      fullscreen={modalType.type === "create" ? true : undefined}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title} phiếu kiểm kê</Modal.Title>
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
                <Form.Label>Kho kiểm kê</Form.Label>
                {modalType.type === "create" ? (
                  <>
                    <Form.Select
                      name="idWarehouse"
                      value={formData.idWarehouse}
                      onChange={handleChangeReceiptInput}
                      required
                    >
                      <option value="">
                        ------Chọn kho kiểm kê------
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
              {modalType.type === "create" && (
                <>
                  <Form.Group
                    className="mb-3"
                    as={Col}
                    sm="6"
                  >
                    <QRCodeScanner
                      show={show}
                      handleUpdateListData={
                        handleUpdateDetailList
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Hàng hoá được kiểm kê
                    </Form.Label>
                    {modalType.type === "create" ? (
                      <>
                        <Form.Select
                          name="idGoods"
                          value={
                            currentDetail.idGoods
                          }
                          onChange={
                            handleChangeReceiptInput
                          }
                        >
                          <option value="">
                            ----Chọn hàng hoá kiểm
                            kê----
                          </option>
                          {goods.length &&
                            goods.map((item) => (
                              <option
                                key={
                                  item.idGoods
                                }
                                value={
                                  item.idGoods
                                }
                              >
                                ID:{" "}
                                {item.idGoods} -{" "}
                                {item.name} -
                                ĐVT:{" "}
                                {
                                  item.idUnit2
                                    ?.name
                                }
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Text muted>
                          Chọn thủ công nếu không thể
                          quét QR
                        </Form.Text>
                      </>
                    ) : (
                      <Form.Control
                        name="idGoods"
                        type="number"
                        value={currentDetail.idGoods}
                        readOnly
                      ></Form.Control>
                    )}
                  </Form.Group>
                  <Row className="d-flex align-items-center">
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      sm="5"
                    >
                      <FloatingLabel label="Số lượng kiểm kê">
                        <Form.Control
                          type="number"
                          min={0}
                          value={currentDetail.amount}
                          name="amount"
                          onChange={
                            handleChangeReceiptInput
                          }
                        />
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      sm="5"
                    >
                      <FloatingLabel label="Số lượng tồn">
                        <Form.Control
                          readOnly
                          value={
                            currentDetail.storedAmount
                          }
                        />
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      sm="2"
                    >
                      {!(
                        currentDetail.amount ===
                        currentDetail.storedAmount
                      ) ? (
                        <Badge
                          bg={
                            currentDetail.amount >
                              currentDetail.storedAmount
                              ? "warning"
                              : "danger"
                          }
                        >
                          {currentDetail.amount >
                            currentDetail.storedAmount
                            ? "Thừa"
                            : "Thiếu"}
                        </Badge>
                      ) : (
                        <Badge bg="success">Đủ</Badge>
                      )}
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      sm
                    >
                      <FloatingLabel label="Hạn sử dụng">
                        <Form.Control
                          type="date"
                          readOnly
                          value={currentDetail.exp}
                        />
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      as={Col}
                      sm
                    >
                      <FloatingLabel label="Ngày nhập kho">
                        <Form.Control
                          type="datetime-local"
                          value={
                            currentDetail.importDate &&
                            convertUTCToVNTime(
                              currentDetail.importDate
                            )
                          }
                          readOnly
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col}>
                      <FloatingLabel label="Tầng">
                        <Form.Control
                          type="number"
                          readOnly
                          value={currentDetail.floor}
                        />
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col}>
                      <FloatingLabel label="Kệ">
                        <Form.Control
                          type="number"
                          value={currentDetail.slot}
                          readOnly
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col}>
                      <FloatingLabel label="Chất lượng">
                        <Form.Select
                          value={
                            currentDetail.quality
                          }
                          name="quality"
                          onChange={
                            handleChangeReceiptInput
                          }
                        >
                          <option value="">
                            ----Chọn chất lượng----
                          </option>
                          <option>
                            Còn tốt 100%
                          </option>
                          <option>
                            Kém phẩm chất
                          </option>
                          <option>
                            Mất phẩm chất
                          </option>
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col}>
                      <FloatingLabel label="Hướng xử lý">
                        <Form.Control
                          name="solution"
                          value={
                            currentDetail.solution
                          }
                          onChange={
                            handleChangeReceiptInput
                          }
                        />
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Form.Group>
                    <Button
                      variant={
                        currentDetail.idGoods !== 0
                          ? "primary"
                          : "outline-primary"
                      }
                      style={{
                        width: "100%",
                        fontWeight: "bold",
                      }}
                      onClick={handleAddOrderDetail}
                    >
                      Thêm chi tiết phiếu
                    </Button>
                  </Form.Group>
                </>
              )}
            </Col>

            <Col lg={6}>
              <h4>Chi tiết phiếu kiểm kê</h4>
              <StocktakingReceiptDetailTable
                goods={goods}
                listData={formData.stocktakingDetails}
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
                {`Tạo lúc ${formData.date &&
                  stringToDate(formData.date?.toString())
                  } bởi ${formData.idUser2?.username}`}
              </Form.Text>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="reset" onClick={handleCancel}>
          {modalType.type === "update" ? "Đóng" : "Huỷ"}
        </Button>
        {modalType.type === "create" && (
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmitCreate}
          >
            Lưu phiếu
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default memo(StocktakingReceiptModal);
