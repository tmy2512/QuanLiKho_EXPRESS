import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ProviderModal from "~/components/Layout/components/Modal/ProviderModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import { getCookie } from "~/utils/cookies";
import { iProviderProps } from "../types";
import { getAllProviders } from "~/apis/providerAPI";
import ProviderTable from "~/components/Layout/components/Table/ProviderListTable/ProviderTable";
import { Link, useParams } from "react-router-dom";

const initProviderData: iProviderProps = {
  idProviders: 1,
  name: "",
  address: "",
  deletedAt: new Date(),
};

function ProviderView() {
  const params = useParams();
  const action = params.action;
  const initShowModal = action ? true : false;
  const [showModal, setShowModal] = useState(initShowModal);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iProviderProps[]>([
    initProviderData,
  ]);
  const [formData, setFormData] = useState<iProviderProps>(initProviderData);

  const handleSetListData = useCallback(() => {
    const jwt = getCookie("jwt");
    if (jwt) {
      getAllProviders().then((data) => data && setListData(data));
    }
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
      <h2>Danh sách nhà cung cấp</h2>
      <Button onClick={handleToggleShowModal} className="my-sm-3 me-3">
        <i className="fa-solid fa-plus"></i>
        &nbsp; Thêm NCC mới
      </Button>
      <Link to={"/list/import-orders/create"}>
        <Button className="my-3">
          <i className="fa-solid fa-arrow-right-to-bracket"></i>&nbsp;
          Đặt đơn nhập kho mới
        </Button>
      </Link>
      <ProviderModal
        show={showModal}
        onHide={handleToggleShowModal}
        listData={listData}
        setListData={setListData}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
      />
      <ProviderTable
        listData={listData}
        setListData={setListData}
        toggleShowModal={handleToggleShowModal}
        setModalType={setModalType}
        setFormData={setFormData}
      />
    </>
  );
}

export { initProviderData };
export default ProviderView;
