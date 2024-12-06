import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { getAllTransportReceiptByStatus } from "~/apis/transportReceiptAPI";
import { iModalTypes } from "~/components/Layout/components/Modal/types";

import TransportReceiptModal from "~/components/Layout/components/Modal/TransportReceiptModal";
import TransportReceiptTable from "~/components/Layout/components/Table/TransportReceiptsTable/TransportReceiptTable";
import {
  iTransportReceiptItemProps,
  iTransportReceiptProps,
} from "~/views/types";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";
import generateTransportReceiptHTML from "~/utils/receiptGenerator/generateTransportReceiptHTML";

const initTransportReceipt: iTransportReceiptProps = {
  idUserSend: 0,
  idUserReceive: 0,
  transportFromDate: "",
  transportToDate: "",
  idWarehouseFrom: 0,
  idWarehouseTo: 0,
  plateNumber: "",
  transportDetails: [],
  status: 0,
};
const initTransportReceiptItem: iTransportReceiptItemProps = {
  idTransportReceipts: 0,
  transportFromDate: "",
  transportToDate: "",
  idWarehouseTo: 0,
  idWarehouseFrom: 0,
  status: 0,
};

interface iTabProps {
  eventKey: string;
  title: ReactNode;
}

function TransportReceiptView() {
  //SHARED PROPS
  const [key, setKey] = useState("on_the_way");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iTransportReceiptItemProps[]>([
    initTransportReceiptItem,
  ]);
  const [formData, setFormData] =
    useState<iTransportReceiptProps>(initTransportReceipt);
  const role = useRole();

  const tabs: iTabProps[] = [
    {
      eventKey: "on_the_way",
      title: "Đang điều chuyển",
    },
    {
      eventKey: "finished",
      title: "Đã điều chuyển",
    },
  ];

  //HANDLER
  const handleSelected = useCallback(() => {
    let statusCode: number = 0;
    switch (key) {
      case "on_the_way":
        statusCode = 3;
        break;
      case "finished":
        statusCode = 4;
        break;
    }
    getAllTransportReceiptByStatus(statusCode).then((data) =>
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

  const handlePrint = () => {
    const html = generateTransportReceiptHTML(formData);
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      const img = printWindow.document.querySelector("img");
      if (img) {
        img.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    }, 1000);
  };

  return (
    <>
      <h2>Danh sách phiếu điều chuyển kho</h2>
      <Tabs
        defaultActiveKey="on_the_way"
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
                {key === "on_the_way" &&
                  (role === ROLE_ID.OPERATION_1 ||
                    role === ROLE_ID.CEO_6) && (
                    <>
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
                      </Button>{" "}
                      &nbsp;{" "}
                      <Button
                        onClick={() => {
                          handleToggleShowModal();
                          setModalType({
                            type: "update",
                          });
                        }}
                        className="mb-3"
                        variant="outline-primary"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-expand"></i>
                        &nbsp; Xác nhận đã điều chuyển
                      </Button>
                    </>
                  )}

                <TransportReceiptModal
                  show={showModal}
                  onHide={handleToggleShowModal}
                  listData={listData}
                  setListData={setListData}
                  modalType={modalType}
                  formData={formData}
                  setFormData={setFormData}
                  handlePrint={handlePrint}
                />

                <TransportReceiptTable
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

export { initTransportReceipt, initTransportReceiptItem };
export default TransportReceiptView;
