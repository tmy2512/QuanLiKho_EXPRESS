import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getAllImportOrderByStatus } from "~/apis/importOrderAPI";
import ImportOrderModal from "~/components/Layout/components/Modal/ImportOrderModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import OrderTable from "~/components/Layout/components/Table/ImportOrderListTable/OrderTable";
import { IMPORT_ORDER_DETAIL_KEY } from "~/constants/localStorage";
import { ROLE_ID } from "~/constants/roles";
import useRole from "~/hooks/useRole";

import { iImportOrderProps } from "~/views/types";

let initImportOrderData: iImportOrderProps = {
  idCreated: 0,
  idImportOrders: 0,
  orderDate: "",
  idProvider: 0,
  status: 0,
  palletCode: 0,
  importOrderDetails: [],
};

interface iTabProps {
  eventKey: string;
  title: ReactNode;
}

function ImportOrderView() {
  //SHARED PROPS
  const params = useParams();
  const action = params.action;
  const initShowModal = action ? true : false;
  const [key, setKey] = useState("in-process");
  const [showModal, setShowModal] = useState(initShowModal);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iImportOrderProps[]>([]);
  const [formData, setFormData] =
    useState<iImportOrderProps>(initImportOrderData);
  const role = useRole();

  //get continousData from session storage
  useEffect(() => {
    const continousOrder = sessionStorage.getItem(IMPORT_ORDER_DETAIL_KEY);
    if (continousOrder) {
      setFormData(JSON.parse(continousOrder));
    }
  }, []);
  const tabs: iTabProps[] = [
    {
      eventKey: "in-process",
      title: "Đang xử lý",
    },
    {
      eventKey: "finished",
      title: "Đã hoàn thành",
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
      case "in-process":
        statusCode = 0;
        break;
      case "finished":
        statusCode = 1;
        break;
      case "failed":
        statusCode = 2;
        break;
    }
    getAllImportOrderByStatus(statusCode).then((data) => data && setListData(data));
  }, [key]);

  useEffect(() => {
    handleSelected();
  }, [handleSelected]);

  const handleToggleShowModal = () => {
    setShowModal(!showModal);
    setModalType({ type: "create" });
  };

  return (
    <>
      <h2>Danh sách đơn đặt hàng từ nhà cung cấp</h2>
      <Tabs
        defaultActiveKey="in-process"
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
                {key === "in-process" &&
                  (role === ROLE_ID.ASSURANCE_3 ||
                    role === ROLE_ID.CEO_6) && (
                    <Button
                      onClick={handleToggleShowModal}
                      className="mb-3"
                      variant="outline-primary"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                      &nbsp; Thêm mới
                    </Button>
                  )}

                <ImportOrderModal
                  setKey={setKey}
                  show={showModal}
                  onHide={handleToggleShowModal}
                  listData={listData}
                  setListData={setListData}
                  modalType={modalType}
                  formData={formData}
                  setFormData={setFormData}
                />

                <OrderTable
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

export { initImportOrderData };
export default ImportOrderView;
