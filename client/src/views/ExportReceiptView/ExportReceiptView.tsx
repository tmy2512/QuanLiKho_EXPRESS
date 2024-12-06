import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { getAllExportReceiptByStatus } from "~/apis/exportReceiptAPI";
import { iModalTypes } from "~/components/Layout/components/Modal/types";

import { createExportOrder } from "~/apis/exportOrderAPI";
import { getAllGoods } from "~/apis/goodsAPI";
import {
  getDistricts,
  getProvinces,
  getWards,
  iDistrictProps,
  iProvinceProps,
  iWardProps,
} from "~/apis/provinceAPI";
import ExportReceiptModal from "~/components/Layout/components/Modal/ExportReceiptModal";
import ExportReceiptTable from "~/components/Layout/components/Table/ExportReceiptsTable/ExportReceiptTable";
import { ROLE_ID } from "~/constants/roles";
import useRole from "~/hooks/useRole";
import {
  iExportDetailProps,
  iExportOrderProps,
  iExportReceiptItemProps,
  iExportReceiptProps,
  iGoodsItemProps,
} from "~/views/types";
import { initialWarehouseDataState } from "../WarehouseView/WarehouseView";

const initExportOrder: iExportOrderProps = {
  idExportOrders: 0,
  orderDate: "",
  provinceCode: "",
  districtCode: "",
  wardCode: "",
  address: "",
  status: 0,
  exportOrderDetails: [],
};
const initExportReceipt: iExportReceiptProps = {
  idExportReceipts: 0,
  idWarehouse: 0,
  idExportOrder: 0,
  idUserExport: 0,
  exportDate: "",
  status: 0,
  palletCode: 0,
  idExportOrder2: initExportOrder,
  idWarehouse2: initialWarehouseDataState,
  usernameCreated: "",
};
const initExportReceiptItem: iExportReceiptItemProps = {
  idExportReceipts: 0,
  idWarehouse: 0,
  idWarehouse2: {
    provinceCode: "",
    address: "",
    idWarehouse: 0,
    name: "",
    totalFloors: 0,
    totalSlots: 0,
    disabled: 0,
  },
  idExportOrder2: initExportOrder,
  exportDate: "",
  status: 0,
};

interface iTabProps {
  eventKey: string;
  title: ReactNode;
}

function ExportReceiptView() {
  //SHARED PROPS
  const [key, setKey] = useState("finished");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iExportReceiptItemProps[]>([]);
  const [formData, setFormData] =
    useState<iExportReceiptProps>(initExportReceipt);
  const [provinces, setProvinces] = useState<iProvinceProps[]>([]);
  const [districts, setDistricts] = useState<iDistrictProps[]>([]);
  const [wards, setWards] = useState<iWardProps[]>([]);
  const [goods, setGoods] = useState<iGoodsItemProps[]>([]);
  const [toggleCreateOrder, setToggleCreateOrder] = useState(false);
  const role = useRole();

  useEffect(() => {
    getAllGoods().then((data) => {
      data && setGoods(data);
    });
  }, []);

  //TOGGLE AUTO GENERATE EXPORT ORDERS
  useEffect(() => {
    let orderInterval: any;

    if (toggleCreateOrder) {
      orderInterval = setInterval(() => {
        generateRandomOrder();
      }, 1000);
    }

    return () => clearInterval(orderInterval);
  }, [toggleCreateOrder]);

  const tabs: iTabProps[] = [
    {
      eventKey: "finished",
      title: "Đã xuất kho",
    },
    {
      eventKey: "failed",
      title: "Đã huỷ bỏ",
    },
  ];

  //HANDLER
  const handleSelected = useCallback(() => {
    let statusCode: number = 0;
    switch (key) {
      case "finished":
        statusCode = 0;
        break;
      case "failed":
        statusCode = 1;
        break;
    }
    getAllExportReceiptByStatus(statusCode).then((data) =>
      data && setListData(data)
    );
  }, [key]);

  useEffect(() => {
    handleSelected();
  }, [handleSelected]);

  const handleToggleShowModal = () => {
    setShowModal(!showModal);
    setModalType({ type: "create" });
  };

  //AUTO GENERATE EXPORT ORDER (SIMULATE SHOPEE ORDER API)
  const generateRandomOrder = async () => {
    //GENERATE RANDOM PROVINCE OF ORDER
    const provinceData = await getProvinces();
    if (!provinceData) return;
    setProvinces(provinceData);
    const randomProvinceIndex = Math.floor(
      Math.random() * (provinceData?.length - 1)
    );
    const provinceCode = provinceData[randomProvinceIndex].province_id;

    const districtData = await getDistricts(provinceCode);
    if (!districtData) return;
    setDistricts(districtData);
    const randomDistrictIndex = Math.floor(
      Math.random() * (districtData?.length - 1)
    );
    const districtCode = districtData[randomDistrictIndex].district_id;

    const wardData = await getWards(districtCode);
    if (!wardData) return;
    setWards(wardData);
    const randomWardIndex = Math.floor(
      Math.random() * (wardData?.length - 1)
    );
    const wardCode = wardData[randomWardIndex].ward_id;
    const address = `Số 3 ngách 121/33 tổ 3`;

    //EXPORT ORDER DETAILS
    const exportOrderDetails: iExportDetailProps[] = [];
    const lightGoods = goods.filter(
      (goodsItem) => goodsItem.isHeavy === false
    );
    const detailCount = Math.floor(
      Math.random() * (lightGoods?.length - 1)
    );

    if (detailCount === 1) {
      const heavyGoods = goods.filter(
        (goodsItem) => goodsItem.isHeavy === true
      );
      const randomGoodsIndex = Math.round(
        Math.random() * (heavyGoods?.length - 1)
      );

      const randomGoodsId = heavyGoods[randomGoodsIndex].idGoods;

      const randomAmount = Math.floor(Math.random() * 10);
      if (
        randomAmount > heavyGoods[randomGoodsIndex].amount ||
        randomAmount === 0
      )
        return;

      exportOrderDetails.push({
        idGoods: randomGoodsId,
        amount: randomAmount,
      });
    } else
      for (let i = 0; i < detailCount; i++) {
        const randomGoodsIndex = Math.floor(
          Math.random() * (lightGoods?.length - 1)
        );
        const randomGoodsId = lightGoods[randomGoodsIndex].idGoods;
        const isExisted = exportOrderDetails.find(
          (detail) => detail.idGoods === randomGoodsId
        );
        if (isExisted) break;
        const randomAmount = Math.floor(Math.random() * 10);
        if (
          randomAmount > lightGoods[randomGoodsIndex].amount ||
          randomAmount === 0
        )
          break;

        exportOrderDetails.push({
          idGoods: randomGoodsId,
          amount: randomAmount,
        });
      }
    const orderDate = new Date().toISOString();
    const exportOrder: iExportOrderProps = {
      orderDate,
      provinceCode,
      districtCode,
      wardCode,
      address,
      exportOrderDetails,
    };
    if (exportOrder.exportOrderDetails.length === 0) return;

    //call API
    createExportOrder(exportOrder).then(() =>
      console.log("CÓ ĐƠN HÀNG MỚI")
    );
  };
  //

  return (
    <>
      <h2>Danh sách phiếu xuất kho</h2>
      <Tabs
        defaultActiveKey="finished"
        activeKey={key}
        id="fill-tabs"
        className="my-3"
        variant="pills"
        fill
        justify
        style={{
          fontWeight: "bold",
        }}
        onSelect={(key) => {
          key && setKey(key);
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.eventKey}
            eventKey={tab.eventKey}
            title={tab.title}
          >
            {key === tab.eventKey && (
              <>
                <hr />
                {(role === ROLE_ID.OPERATION_1 ||
                  role === ROLE_ID.CEO_6) && (
                    <>
                      {key === "finished" && (
                        <Button
                          onClick={handleToggleShowModal}
                          className="mb-3"
                          variant="outline-primary"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          <i className="fa-solid fa-plus"></i>
                          &nbsp; Thêm mới phiếu xuất kho
                        </Button>
                      )}
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        onClick={() =>
                          setToggleCreateOrder(
                            !toggleCreateOrder
                          )
                        }
                        className="mb-3"
                        variant="outline-primary"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        &nbsp;{" "}
                        {toggleCreateOrder
                          ? "Dừng lấy thêm đơn hàng"
                          : "Lấy thêm đơn hàng"}
                      </Button>
                    </>
                  )}
                <ExportReceiptModal
                  show={showModal}
                  onHide={handleToggleShowModal}
                  listData={listData}
                  setListData={setListData}
                  modalType={modalType}
                  formData={formData}
                  setFormData={setFormData}
                  toggleCreateOrder={toggleCreateOrder}
                />
                <ExportReceiptTable
                  tabKey={key}
                  listData={listData}
                  setListData={setListData}
                  toggleShowModal={handleToggleShowModal}
                  setModalType={setModalType}
                  setFormData={setFormData}
                />
              </>
            )}
          </Tab>
        ))}
      </Tabs>
    </>
  );
}

export { initExportOrder, initExportReceipt, initExportReceiptItem };
export default ExportReceiptView;
