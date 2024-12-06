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
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { getAllGoodsTypes } from "~/apis/goodsTypeAPI";
import { getAllGoodsUnits } from "~/apis/goodsUnitAPI";
import { getAllWarehouses, getWarehouseSlotsById } from "~/apis/warehouseAPI";
import { getCookie } from "~/utils/cookies";
import findEmptyWarehouseSlots from "~/utils/findEmptyWarehouseSlots";
import stringToDate from "~/utils/stringToDate";
import { initGoodsInfo } from "~/views/GoodsView/GoodsView";
import {
  iGoodsItemProps,
  iGoodsProps,
  iGoodsTypeProps,
  iGoodsUnitProps,
  iWarehouseItemProps,
} from "~/views/types";
import WarehouseDiagram from "../WarehouseDiagram/WarehouseDiagram";
import { iModalTypes } from "./types";
import { createGoods, updateGoods } from "~/apis/goodsAPI";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";
import { QR_API_ROOT } from "~/constants";

interface iWarehouseSlots {
  warehouse: {
    totalFloors: number;
    totalSlotsPerFloor: number;
  };
  goodsSlots: {
    idWarehouse: number;
    floor: number;
    slot: number;
    idGoods: number;
    name: string;
  }[];
}
interface iSlotsProp {
  floor: number;
  slot: number;
  good?: {
    floor: number;
    idGoods: number;
    idWarehouse: number;
    name: string;
    slot: number;
  };
}
const initWarehouseSlots = {
  warehouse: {
    totalFloors: 0,
    totalSlotsPerFloor: 0,
  },
  goodsSlots: [],
};

function GoodsModal(props: {
  show: true | false;
  onHide: () => void;
  listData: iGoodsItemProps[];
  setListData: Dispatch<SetStateAction<iGoodsItemProps[]>>;
  modalType: iModalTypes;
  formData: iGoodsProps;
  setFormData: Dispatch<React.SetStateAction<iGoodsProps>>;
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
  const [goodsTypes, setGoodsTypes] = useState<iGoodsTypeProps[]>([]);
  const [warehouses, setWarehouses] = useState<iWarehouseItemProps[]>([]);
  const [goodsUnits, setGoodsUnits] = useState<iGoodsUnitProps[]>([]);
  const initGroup = "------Chưa xác định------";
  const [goodsGroup, setGoodGroup] = useState(initGroup);
  const [warehouseSlots, setWarehouseSlots] =
    useState<iWarehouseSlots>(initWarehouseSlots);
  const [slots, setSlots] = useState<iSlotsProp[]>([
    {
      floor: 0,
      slot: 0,
      good: {
        floor: 0,
        idGoods: 0,
        idWarehouse: 0,
        name: "",
        slot: 0,
      },
    },
  ]);
  const [radioValue, setRadioValue] = useState("0-0");
  const role = useRole();
  //Goods QR
  const qrObject = {
    idGoods: formData.idGoods,
  };
  const qrData = encodeURIComponent(JSON.stringify(qrObject));

  switch (modalType.type) {
    case "create":
      title = "Thêm mới";
      break;
    case "update":
      title = "Xem / Chỉnh sửa thông tin";
      break;
  }

  useEffect(() => {
    getAllGoodsTypes().then((data) => {
      if (!data || !data.length) return;
      setGoodsTypes(data);
      const currentGroup = data.find(
        (type) => type.idGoodsTypes === formData.idType
      )?.idGoodsGroup2?.name;
      if (currentGroup) {
        setGoodGroup(currentGroup);
      }
    });

    getAllWarehouses().then((data) => {
      data && setWarehouses(data);
    });
    getAllGoodsUnits().then((data) => {
      data && setGoodsUnits(data);
    });

    renderWarehouseDiagram(formData.idWarehouse);
  }, [formData.idWarehouse]);
  const renderWarehouseDiagram = useCallback(
    (idWarehouse: number) => {
      if (idWarehouse === 0) return;

      getWarehouseSlotsById(idWarehouse).then((data: any) => {
        if (!data.error && data.goods) {
          const goodsSlots = data.goods.map((good: iGoodsProps) => {
            return {
              idWarehouse: data.idWarehouse,
              floor: good.floor,
              slot: good.slot,
              idGoods: good.idGoods,
              name: good.name,
            };
          });

          setWarehouseSlots({
            warehouse: {
              totalFloors: data.totalFloors,
              totalSlotsPerFloor: data.totalSlots,
            },
            goodsSlots,
          });
        }
      });
    },
    [warehouseSlots, warehouses]
  );
  useEffect(
    () => setSlots(findEmptyWarehouseSlots(warehouseSlots)),
    [warehouseSlots]
  );

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    const { value, name } = e.target;

    if (name === "isHeavy") {
      setFormData((prev) => ({
        ...prev,
        [name]: !prev.isHeavy,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "idType") {
      const groupName = goodsTypes.find(
        (type) => type.idGoodsTypes === +value
      )?.idGoodsGroup2?.name;
      groupName && setGoodGroup(groupName);
    }
    if (name === "idWarehouse") renderWarehouseDiagram(+value);
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
    //trim()
    formData.name = formData.name.trim();
    formData.idType = +formData.idType;
    formData.idCreated = +getCookie("id");

    //set floor and slot
    if (radioValue === "0-0") {
      alert("Vui lòng chọn vị trí sẽ chứa hàng trong kho!");
      return;
    } else {
      const locationArray = radioValue.split("-");
      formData.floor = +locationArray[0];
      formData.slot = +locationArray[1];
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
    (e) => {
      const isValidated = validateForm();
      e.preventDefault();
      e.stopPropagation();

      //call API
      isValidated &&
        createGoods(formData)
          .then((data) => {
            data && setListData((prev) => [...prev, data]);
            if (!data.error) {
              handleCancel();
              setRadioValue("0-0");
            }
          })
          .catch((error) => console.log(error));
    },
    [formData, setListData, radioValue]
  );

  const handleSubmitUpdate: FormEventHandler<HTMLButtonElement> = (e) => {
    const isValidated = validateForm();
    e.preventDefault();
    e.stopPropagation();
    if (!isValidated) return;
    const managerId = +getCookie("id");
    formData.idUpdated = managerId;

    updateGoods(formData).then(() => {
      listData.forEach((data, index) => {
        if (data.idGoods === formData.idGoods) {
          //deep clone
          const newData = [...listData];
          newData.splice(index, 1, {
            ...data,
            name: formData.name,
            exp: formData.exp,
          });
          setListData(newData);
        }
      });
    });
    handleCancel();
  };

  const handleCancel = () => {
    setRadioValue("0-0");
    setWarehouseSlots(initWarehouseSlots);
    setFormData(initGoodsInfo);
    setValidated(false);
    onHide();
  };

  return (
    <Modal
      backdrop={modalType.type === "create" ? "static" : undefined}
      show={show}
      onHide={handleCancel}
      keyboard={false}
      fullscreen
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${title} mặt hàng`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          ref={formRef}
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <Row>
            <Col lg={6}>
              <Row className="mb-3">
                <Form.Group as={Col} sm={8}>
                  <FormLabel>Tên mặt hàng</FormLabel>
                  <Form.Control
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    Bắt buộc nhập
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={4}>
                  <FormLabel>Số lượng</FormLabel>
                  <Form.Control
                    readOnly
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    autoComplete="off"
                    type="number"
                    min={0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Bắt buộc nhập
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} sm>
                  <Form.Label>Loại mặt hàng</Form.Label>
                  <Form.Select
                    required
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                  >
                    <option value="">
                      ------Chọn loại hàng------
                    </option>
                    {goodsTypes.length &&
                      goodsTypes.map((type) => (
                        <option
                          key={type.idGoodsTypes}
                          value={type.idGoodsTypes}
                        >
                          {type.name}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Bắt buộc nhập
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm>
                  <Form.Label>Nhóm mặt hàng</Form.Label>
                  <Form.Control
                    required
                    readOnly
                    value={goodsGroup}
                    aria-describedby="GoodsGroupHelpBlock"
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Bắt buộc chọn
                  </Form.Control.Feedback>
                  <Form.Text id="GoodsGroupHelpBlock" muted>
                    Mỗi loại hàng thuộc một nhóm hàng
                  </Form.Text>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} sm>
                  <Form.Label>Kho chứa</Form.Label>
                  <Form.Select
                    required
                    aria-describedby="WarehouseHelpBlock"
                    name="idWarehouse"
                    value={formData.idWarehouse}
                    onChange={handleChange}
                  >
                    <option value="">
                      ------Chọn kho------
                    </option>
                    {warehouses.length &&
                      warehouses.map((warehouse) => (
                        <option
                          key={warehouse.idWarehouse}
                          value={
                            warehouse.idWarehouse
                          }
                        >
                          {warehouse.name}
                        </option>
                      ))}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    Bắt buộc chọn
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm>
                  <Form.Label>Đơn vị tính</Form.Label>
                  <Form.Select
                    required
                    name="idUnit"
                    value={formData.idUnit}
                    onChange={handleChange}
                    onBlur={() => customValidateDate()}
                  >
                    <option value="">
                      ------Chọn đơn vị tính------
                    </option>
                    {goodsUnits.length &&
                      goodsUnits.map((unit) => (
                        <option
                          key={unit.idGoodsUnits}
                          value={unit.idGoodsUnits}
                        >
                          {unit.name}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Bắt buộc chọn
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm>
                  <Form.Label>
                    Có phải hàng cồng kềnh không?
                  </Form.Label>
                  <Form.Check
                    required
                    type="switch"
                    name="isHeavy"
                    checked={formData.isHeavy}
                    onChange={handleChange}
                  ></Form.Check>
                  <Form.Control.Feedback type="invalid">
                    Bắt buộc chọn
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Text id="WarehouseHelpBlock" muted>
                  Việc lựa chọn kho ảnh hưởng tới lựa chọn vị
                  trí tầng chứa và vị trí kệ chứa
                  <br />
                  Đỗi với hàng hoá mới, có thể lựa chọn tầng /
                  kệ khi nhập hàng
                </Form.Text>
              </Row>
              <Row className="mb-3">
                {modalType.type === "update" && (
                  <>
                    <Form.Group as={Col} sm>
                      <Form.Label>
                        Ngày giờ nhập kho
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        required
                        name="importDate"
                        ref={importDateRef}
                        value={formData.importDate}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Bắt buộc chọn
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} sm>
                      <Form.Label>Hạn sử dụng</Form.Label>
                      <Form.Control
                        type="date"
                        required
                        ref={expRef}
                        name="exp"
                        value={formData.exp}
                        onChange={handleChange}
                        onBlur={() =>
                          customValidateDate()
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Bắt buộc chọn
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
              </Row>
              {modalType.type === "update" && (
                <>
                  <Row className="mb-3">
                    <Form.Group as={Col} sm>
                      <Form.Label>
                        Số tầng ban đầu
                      </Form.Label>
                      <Form.Control
                        readOnly
                        name="floor"
                        value={formData.floor}
                      />
                    </Form.Group>

                    <Form.Group as={Col} sm>
                      <Form.Label>
                        Số kệ ban đầu
                      </Form.Label>
                      <Form.Control
                        readOnly
                        name="slot"
                        value={formData.slot}
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col}>
                      <FormLabel>
                        Mã QR hàng hoá
                      </FormLabel>
                      <br />
                      <Image
                        src={`${QR_API_ROOT}&data=${qrData}`}
                      />
                    </Form.Group>
                  </Row>
                </>
              )}
            </Col>

            <Col lg={6}>
              <Row className="mb-3">
                <Form.Group as={Col} sm>
                  <Form.Label>
                    Chọn vị trí chứa hàng: &nbsp;{" "}
                  </Form.Label>
                  {slots.length > 0 && (
                    <WarehouseDiagram
                      radios={slots}
                      setRadioValue={setRadioValue}
                      radioValue={radioValue}
                    />
                  )}
                </Form.Group>
              </Row>
            </Col>
          </Row>

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
          {modalType.type === "update" && (
            <>
              <Form.Text>
                {`Tạo lúc ${formData.createdAt &&
                  stringToDate(formData.createdAt?.toString())
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
        {(role === ROLE_ID.ASSURANCE_3 ||
          role === ROLE_ID.OPERATION_1 ||
          role === ROLE_ID.CEO_6) &&
          (modalType.type === "create" ? (
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmitCreate}
            >
              Thêm mới
            </Button>
          ) : (
            <Button
              variant="warning"
              type="submit"
              onClick={handleSubmitUpdate}
            >
              Cập nhật chỉnh sửa
            </Button>
          ))}
      </Modal.Footer>
    </Modal>
  );
}

export type { iSlotsProp, iWarehouseSlots };
export default memo(GoodsModal);
