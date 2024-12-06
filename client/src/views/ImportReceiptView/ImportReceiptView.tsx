import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { getAllImportReceiptByStatus } from "~/apis/importReceiptAPI";
import ImportReceiptModal from "~/components/Layout/components/Modal/ImportReceiptModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import ReceiptTable from "~/components/Layout/components/Table/ImportReceiptsTable/ReceiptTable";

import { iImportReceiptItemProps, iImportReceiptProps } from "~/views/types";
import { initImportOrderData } from "../ImportOrderView/ImportOrderView";
import { initProviderData } from "../ProviderView/ProviderView";
import { initialWarehouseDataState } from "../WarehouseView/WarehouseView";
import { useParams } from "react-router-dom";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

let initImportReceipt: iImportReceiptProps = {
  idImportReceipts: 0,
  idWarehouse: 0,
  idImportOrder: 0,
  idProvider: 0,
  idUserImport: 0,
  importDate: "",
  status: 0,
  idImportOrder2: initImportOrderData,
  idProvider2: initProviderData,
  idWarehouse2: initialWarehouseDataState,
  usernameCreated: "",
};
let initImportReceiptItem: iImportReceiptItemProps = {
  idImportReceipts: 0,
  idWarehouse: 0,
  idWarehouse2: {
    address: "",
    provinceCode: "",
    idWarehouse: 0,
    name: "",
    totalFloors: 0,
    totalSlots: 0,
    disabled: 0,
  },
  idImportOrder: 0,
  importDate: "",
  status: 0,
};

interface iTabProps {
  eventKey: string;
  title: ReactNode;
}

function ImportReceiptView() {
  const params = useParams();
  const action = params.action;
  const initShowModal = action ? true : false;
  const [key, setKey] = useState("finished");
  const [showModal, setShowModal] = useState(initShowModal);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iImportReceiptItemProps[]>([
    initImportReceiptItem,
  ]);
  const [formData, setFormData] =
    useState<iImportReceiptProps>(initImportReceipt);
  const role = useRole();

  const tabs: iTabProps[] = [
    {
      eventKey: "finished",
      title: "Đã nhập kho",
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
    getAllImportReceiptByStatus(statusCode).then((data) =>
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

  return (
    <>
      <h2>Danh sách phiếu nhập kho</h2>
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
                {key === "finished" &&
                  (role === ROLE_ID.OPERATION_1 ||
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

                <ImportReceiptModal
                  show={showModal}
                  onHide={handleToggleShowModal}
                  listData={listData}
                  setListData={setListData}
                  modalType={modalType}
                  formData={formData}
                  setFormData={setFormData}
                />

                <ReceiptTable
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

export { initImportReceipt, initImportReceiptItem };
export default ImportReceiptView;
