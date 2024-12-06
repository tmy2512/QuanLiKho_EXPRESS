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
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";

import { getAllExportReceiptByStatus } from "~/apis/exportReceiptAPI";
import { getProvinces, iProvinceProps } from "~/apis/provinceAPI";
import {
  createTransportReceipt,
  getTransportReceiptById,
  updateTransportReceipt,
} from "~/apis/transportReceiptAPI";
import { getWarehousesByProvince } from "~/apis/warehouseAPI";
import convertUTCToVNTime from "~/utils/convertUTCToVNTime";
import { getCookie } from "~/utils/cookies";
import stringToDate from "~/utils/stringToDate";
import { initTransportReceipt } from "~/views/TransportReceiptView/TransportReceiptView";
import { initialWarehouseDataState } from "~/views/WarehouseView/WarehouseView";
import {
  iExportReceiptItemProps,
  iTransportReceiptItemProps,
  iTransportReceiptProps,
  iWarehouseDataProps,
} from "~/views/types";
import QRCodeScanner from "../QRCodeScanner/QRCodeScanner";
import TransportReceiptDetailTable from "../Table/TransportReceiptsTable/TransportReceiptDetailTable";
import { iModalTypes } from "./types";

interface iReceiptByProvince {
  provinceCode: string;
  provinceReceipts: iExportReceiptItemProps[];
  idWarehouse2: iWarehouseDataProps;
}

const initReceiptByProvince = {
  provinceCode: "",
  provinceReceipts: [],
  idWarehouse2: initialWarehouseDataState,
};

function TransportReceiptModal(props: {
  show: true | false;
  onHide: () => void;
  listData: iTransportReceiptItemProps[];
  setListData: Dispatch<SetStateAction<iTransportReceiptItemProps[]>>;
  modalType: iModalTypes;
  formData: iTransportReceiptProps;
  setFormData: Dispatch<React.SetStateAction<iTransportReceiptProps>>;
  handlePrint: () => void;
}) {
  const {
    show,
    onHide,
    listData,
    setListData,
    modalType,
    formData,
    setFormData,
    handlePrint,
  } = props;
  const [validated, setValidated] = useState(false);
  const toDateRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [provinces, setProvinces] = useState<iProvinceProps[]>([]);
  const [receipts, setReceipts] = useState<iReceiptByProvince[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<iReceiptByProvince>(
    initReceiptByProvince
  );
  const [warehousesTo, setWarehousesTo] = useState<iWarehouseDataProps[]>([]);
  const [isHeavy, setIsHeavy] = useState<boolean>(false);
  const [scanData, setScanData] = useState<{
    idTransportReceipts: number;
    transportLength: number;
  }>({
    idTransportReceipts: 0,
    transportLength: 0,
  });

  let title: string;
  switch (modalType.type) {
    case "create":
      title = "Thêm mới";
      break;
    case "update":
      title = "Xem / Cập nhật thông tin";
      break;
  }

  useEffect(() => {
    getProvinces().then((data) => {
      data && setProvinces(data);
    });
  }, []);

  useEffect(() => {
    const filterReceiptByProvince = (
      exportReceipts: iExportReceiptItemProps[]
    ): iReceiptByProvince[] => {
      const provinceReceipts: iReceiptByProvince[] = [];
      let originalReceipt: iExportReceiptItemProps[] = [];

      //FILTER BY STATUS ON THE WAY
      //FILTER BY HEAVY GOODS
      if (isHeavy) {
        originalReceipt = exportReceipts.filter(
          (receipt) =>
            receipt.idExportOrder2.exportOrderDetails[0].idGoods2
              ?.isHeavy === true && receipt.status === 2
        );
      } else originalReceipt = [...exportReceipts];

      //FILTER BY PROVINCE
      for (const receipt of originalReceipt) {
        const existReceiptByProvince = provinceReceipts.find(
          (existProvince) =>
            existProvince.provinceCode ===
            receipt.idExportOrder2.provinceCode
        );
        if (
          existReceiptByProvince &&
          existReceiptByProvince.provinceReceipts.length <= 50
        ) {
          existReceiptByProvince.provinceReceipts.push(receipt);
        } else {
          provinceReceipts.push({
            provinceCode: receipt.idExportOrder2.provinceCode,
            provinceReceipts: [receipt],
            idWarehouse2: receipt.idWarehouse2,
          });
        }
      }
      return provinceReceipts;
    };
    getAllExportReceiptByStatus(2).then((data) => {
      if (!data || !data.length) return;
      const filteredList = filterReceiptByProvince(data);
      setReceipts(filteredList);
    });
  }, [isHeavy, listData]);

  const handleChangeReceiptInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = async (e) => {
    const { value, name } = e.target;
    switch (name) {
      case "provinceCode":
        const warehouses = await getWarehousesByProvince(value);
        !warehouses.error && setWarehousesTo(warehouses);

        const receiptDetail = receipts.find(
          (receipt) => receipt.provinceCode === value
        );
        setSelectedReceipt(receiptDetail || initReceiptByProvince);
        setFormData((prev) => ({
          ...prev,
          idWarehouseFrom:
            receiptDetail?.provinceReceipts[0]?.idWarehouse2
              ?.idWarehouse || 0,
          idWarehouseTo: 0,
        }));
        break;
      default:
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  };

  const customValidateDate = () => {
    const endDate = toDateRef.current;

    //validate endDate <= startDate
    if (endDate && endDate.value.length > 0) {
      const toDate = new Date(endDate.value);
      const fromDate = new Date(formData.transportFromDate);

      if (fromDate > toDate) {
        endDate.setCustomValidity("Ngày đến không thê sớm hơn ngày đi");
        endDate.reportValidity();
        return false;
      } else {
        endDate.setCustomValidity("");
        endDate.reportValidity();
      }
    }
    return true;
  };

  const validateForm = () => {
    const form = formRef.current;
    const idCreated = getCookie("id");
    formData.idWarehouseFrom = +formData.idWarehouseFrom;
    if (formData.idWarehouseTo)
      formData.idWarehouseTo = +formData.idWarehouseTo;
    formData.idUserSend = +idCreated;
    formData.idUpdated = +idCreated;

    if (formData.transportDetails.length === 0) {
      alert("Vui lòng thêm chi tiết phiếu điều chuyển");
      return false;
    }

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

      //automatic data embed
      formData.transportFromDate = new Date().toString();

      //call API
      if (isValidated) {
        const data = await createTransportReceipt(formData);
        data && setListData((prev) => [data, ...prev]);
        if (!data.error) {
          handlePrint();
          handleCancel();
        }
      }
    },
    [formData, setListData]
  );

  const handleUpdateTransportReceipt: FormEventHandler<HTMLButtonElement> = (
    e
  ) => {
    const isValidated = validateForm();
    if (!isValidated) return;
    e.preventDefault();
    e.stopPropagation();

    //call API
    updateTransportReceipt(formData).then(() => {
      listData.forEach((data, index) => {
        if (data.idTransportReceipts === formData.idTransportReceipts) {
          //deep clone
          const newList = [...listData];
          newList.splice(index, 1);
          setListData(newList);
        }
      });
    });
    handleCancel();
  };

  const handleUpdateTransportDetail = (scanResult: {
    idExportReceipts: number;
    idExportOrder: number;
  }) => {
    const isValidReceipt = selectedReceipt?.provinceReceipts.find(
      (receipt) =>
        receipt.idExportReceipts === scanResult.idExportReceipts &&
        receipt.idExportOrder2.idExportOrders ===
        scanResult.idExportOrder
    );

    if (isValidReceipt) {
      setFormData((prev) => {
        const isExistReceipt = prev.transportDetails.find(
          (receipt) =>
            receipt.idExportReceipt ===
            scanResult.idExportReceipts &&
            receipt.idExportOrder === scanResult.idExportOrder
        );
        if (isExistReceipt) {
          return { ...prev };
        } else
          return {
            ...prev,
            transportDetails: [
              ...prev.transportDetails,
              {
                idExportReceipt: scanResult.idExportReceipts,
                idExportOrder: scanResult.idExportOrder,
              },
            ],
          };
      });
    }
  };

  const handleUpdateTransportStatus = (scanResult: {
    idTransportReceipts: number;
    transportLength: number;
  }) => {
    const transportReceipt = listData.find(
      (receipt) =>
        (receipt.idTransportReceipts = scanResult.idTransportReceipts)
    );
    if (!transportReceipt) return;
    setScanData((prev) => {
      if (prev.idTransportReceipts === scanResult.idTransportReceipts) {
        return prev;
      } else {
        return scanResult;
      }
    });
  };

  //USE EFFECT UPDATE RECEIPT STATUS FINISHED
  useEffect(() => {
    if (scanData.idTransportReceipts) {
      getTransportReceiptById(scanData.idTransportReceipts).then(
        (data) => {
          setFormData({
            ...data,
            transportToDate: new Date().toISOString(),
            idUserReceive: +getCookie("id"),
            idUpdated: +getCookie("id"),
          });
        }
      );
    }
  }, [scanData, setFormData]);

  const handleCancel = () => {
    setIsHeavy(false);
    setSelectedReceipt(initReceiptByProvince);
    setFormData(initTransportReceipt);
    setValidated(false);
    onHide();
  };

  return (
    <Modal
      backdrop={modalType.type === "create" ? "static" : undefined}
      show={show}
      onHide={handleCancel}
      keyboard={modalType.type === "create" ? false : true}
      fullscreen={formData.status < 3 ? true : undefined}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {`${title} phiếu điều chuyển kho `} &nbsp;
          {modalType.type === "update" && formData.status === 3 && (
            <Button onClick={handlePrint}>
              In phiếu điều chuyển kho
            </Button>
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
              <Form.Group className="d-flex">
                <Form.Label
                  htmlFor="isHeavy"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Phiếu điều chuyển cho hàng cồng kềnh
                </Form.Label>
                &nbsp;&nbsp;
                <Form.Check
                  type="switch"
                  id="isHeavy"
                  title="Lọc ra các đơn hàng cồng kềnh"
                  name="isHeavy"
                  checked={isHeavy}
                  disabled={
                    modalType.type === "create"
                      ? false
                      : true
                  }
                  onChange={() => setIsHeavy(!isHeavy)}
                ></Form.Check>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Chọn tỉnh / thành phố đã phân loại hàng
                </Form.Label>
                {modalType.type === "create" ? (
                  <Form.Select
                    required
                    name="provinceCode"
                    value={
                      formData.idWarehouseTo2
                        ?.provinceCode
                    }
                    onChange={handleChangeReceiptInput}
                  >
                    <option value="">
                      ----Chọn tỉnh / thành phố----
                    </option>
                    {receipts.map((receiptByProvince) => (
                      <option
                        key={
                          receiptByProvince.provinceCode
                        }
                        value={
                          receiptByProvince.provinceCode
                        }
                      >
                        Mã tỉnh:{" "}
                        {receiptByProvince.provinceCode ||
                          ""}{" "}
                        - Tổng SL phiếu xuất:{" "}
                        {
                          receiptByProvince
                            .provinceReceipts.length
                        }
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    required
                    name="provinceCode"
                    value={`Mã tỉnh: ${formData.idWarehouseTo2
                        ?.provinceCode || ""
                      } - Tổng SL phiếu xuất: ${formData.transportDetails?.length ||
                      ""
                      }`}
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Biển kiểm soát xe</Form.Label>
                {formData.status === 0 ||
                  formData.status === 3 ? (
                  <>
                    <Form.Control
                      required={
                        modalType.type === "create"
                          ? false
                          : true
                      }
                      placeholder="Ví dụ: 30H-56789"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleChangeReceiptInput}
                      maxLength={10}
                      minLength={7}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Bắt buộc nhập
                    </Form.Control.Feedback>
                    <Form.Text muted>
                      Có thể bỏ qua và cập nhật sau
                    </Form.Text>
                  </>
                ) : (
                  <Form.Control
                    name="plateNumber"
                    value={formData.plateNumber}
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              {(formData.status === 3 ||
                formData.status === 4) && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày đi</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="transportFromDate"
                        value={
                          formData.transportFromDate &&
                          convertUTCToVNTime(
                            formData.transportFromDate
                          )
                        }
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày đến</Form.Label>
                      <Form.Control
                        required={
                          modalType.type === "create"
                            ? false
                            : true
                        }
                        type="datetime-local"
                        name="transportToDate"
                        ref={toDateRef}
                        value={
                          formData.transportToDate &&
                          convertUTCToVNTime(
                            formData.transportToDate
                          )
                        }
                        onChange={handleChangeReceiptInput}
                        onBlur={customValidateDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        Bắt buộc chọn
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
              <Form.Group className="mb-3">
                <Form.Label>Kho đi</Form.Label>
                {modalType.type === "create" ? (
                  <>
                    <Form.Control
                      name="idWarehouse"
                      value={
                        selectedReceipt
                          ? `${selectedReceipt
                            ?.idWarehouse2
                            .name || ""
                          } - Đ/c: ${selectedReceipt
                            .idWarehouse2
                            .address || ""
                          }`
                          : ""
                      }
                      readOnly
                      required
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Bắt buộc chọn
                    </Form.Control.Feedback>
                  </>
                ) : (
                  <Form.Control
                    name="idWarehouse"
                    value={`${formData.idWarehouseFrom2?.name ||
                      ""
                      } - Đ/c: ${formData.idWarehouseFrom2
                        ?.address || ""
                      }`}
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kho đến</Form.Label>
                {modalType.type === "create" ? (
                  <>
                    <Form.Select
                      name="idWarehouseTo"
                      value={formData.idWarehouseTo}
                      onChange={handleChangeReceiptInput}
                      required
                    >
                      <option value="">
                        ----Chọn kho đến----
                      </option>
                      {warehousesTo &&
                        warehousesTo.map((wh) => (
                          <option
                            key={wh.idWarehouse}
                            value={wh.idWarehouse}
                          >
                            {wh.name} - Đ/c:{" "}
                            {wh.address}
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
                    value={`${formData.idWarehouseTo2?.name || ""
                      } - Đ/c: ${formData.idWarehouseTo2?.address ||
                      ""
                      }`}
                    readOnly
                  ></Form.Control>
                )}
              </Form.Group>
              <hr />
            </Col>

            <Col lg={6}>
              <h4>
                Chi tiết phiếu điều chuyển (
                {formData?.transportDetails?.length}/
                {selectedReceipt?.provinceReceipts?.length ||
                  formData.transportDetails?.length}
                )
              </h4>
              {(selectedReceipt.provinceCode ||
                (modalType.type === "update" &&
                  formData.status !== 4)) && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Quét mã QR{" "}
                        {modalType.type === "create"
                          ? "gói hàng"
                          : "phiếu điều chuyển"}
                      </Form.Label>
                      <br />
                      <Row>
                        <Col lg={6}>
                          <QRCodeScanner
                            show={show}
                            handleUpdateListData={(
                              data: any
                            ) => {
                              if (
                                modalType.type ===
                                "create"
                              ) {
                                handleUpdateTransportDetail(
                                  data
                                );
                              } else {
                                handleUpdateTransportStatus(
                                  data
                                );
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                )}
              <TransportReceiptDetailTable
                listData={formData.transportDetails}
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
              {formData.idUpdated && (
                <Form.Text>
                  {`Sửa đổi lần cuối lúc ${formData.updatedAt &&
                    stringToDate(
                      formData.updatedAt?.toString()
                    )
                    }`}
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
            Tạo phiếu
          </Button>
        ) : (
          formData.status === 3 && (
            <Button
              variant="warning"
              onClick={handleUpdateTransportReceipt}
            >
              Cập nhật thông tin phiếu
            </Button>
          )
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default memo(TransportReceiptModal);
