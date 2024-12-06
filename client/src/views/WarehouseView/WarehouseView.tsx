import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getAllWarehouses } from "~/apis/warehouseAPI";
import WarehouseModal from "~/components/Layout/components/Modal/WarehouseModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import WarehouseTable from "~/components/Layout/components/Table/WarehouseListTable/WarehouseTable";
import { getCookie } from "~/utils/cookies";
import { iWarehouseDataProps, iWarehouseItemProps } from "~/views/types";

const managerId = getCookie("id");
const initialWarehouseDataState: iWarehouseDataProps = {
  name: "",
  address: "",
  provinceCode: "",
  totalFloors: 0,
  totalSlots: 0,
  idCreated: +managerId,
  disabled: 0,
};

function WarehouseView() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iWarehouseItemProps[]>([
    {
      idWarehouse: -1,
      name: "",
      address: "",
      provinceCode: "",
      disabled: 0,
    },
  ]);
  const [formData, setFormData] = useState<iWarehouseDataProps>(
    initialWarehouseDataState
  );

  const handleSetListData = useCallback(() => {
    getAllWarehouses().then((data) => data && setListData(data));
  }, []);

  useEffect(() => {
    handleSetListData();
  }, [handleSetListData]);

  const handleToggleShowModal = useCallback(() => {
    setShowModal(!showModal);
    setModalType({ type: "create" });
  }, [showModal]);

  return (
    <>
      <h2>Danh sách kho hàng</h2>

      <Button onClick={handleToggleShowModal} className="my-3">
        <i className="fa-solid fa-plus"></i>
        &nbsp; Thêm mới
      </Button>

      <WarehouseModal
        show={showModal}
        onHide={handleToggleShowModal}
        listData={listData}
        setListData={setListData}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
      />

      <WarehouseTable
        listData={listData}
        setListData={setListData}
        toggleShowModal={handleToggleShowModal}
        setModalType={setModalType}
        setFormData={setFormData}
      />
    </>
  );
}

export { initialWarehouseDataState };
export default WarehouseView;
