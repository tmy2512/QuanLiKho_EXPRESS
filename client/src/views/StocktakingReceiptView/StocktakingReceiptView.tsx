import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getAllGoods } from "~/apis/goodsAPI";
import { getAllStocktakingReceipts } from "~/apis/stocktakingReceiptAPI";
import StocktakingReceiptModal from "~/components/Layout/components/Modal/StocktakingReceiptModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import StocktakingReceiptTable from "~/components/Layout/components/Table/StocktakingReceiptsTable/StocktakingReceiptTable";
import {
  iGoodsItemProps,
  iStocktakingReceiptItemProps,
  iStocktakingReceiptProps,
} from "~/views/types";
import { initialUserDataState } from "../UserView/UserView";
import { initialWarehouseDataState } from "../WarehouseView/WarehouseView";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

const stocktakingInit: iStocktakingReceiptProps = {
  idStocktakingReceipts: 0,
  idWarehouse: 0,
  idWarehouse2: initialWarehouseDataState,
  date: "",
  idUser: 0,
  idUser2: initialUserDataState,
  idUpdated: 0,
  updatedAt: "",
  stocktakingDetails: [],
};
const stocktakingInitItem: iStocktakingReceiptItemProps = {
  idStocktakingReceipts: 0,
  idWarehouse2: initialWarehouseDataState,
  date: "",
};

function StocktakingReceiptView() {
  //SHARED PROPS
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iStocktakingReceiptItemProps[]>([
    stocktakingInitItem,
  ]);
  const [formData, setFormData] =
    useState<iStocktakingReceiptProps>(stocktakingInit);
  const [goods, setGoods] = useState<iGoodsItemProps[]>([]);
  const role = useRole();

  useEffect(() => {
    getAllGoods().then((data) => {
      data && setGoods(data);
    });
    getAllStocktakingReceipts().then((data) => data && setListData(data));
  }, []);

  const handleToggleShowModal = () => {
    setShowModal(!showModal);
    setModalType({ type: "create" });
  };

  return (
    <>
      <h2 className="mb-3">Danh sách phiếu kiểm kê</h2>
      {(role === ROLE_ID.ASSURANCE_3 || role === ROLE_ID.CEO_6) && (
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
      <StocktakingReceiptModal
        show={showModal}
        onHide={handleToggleShowModal}
        listData={listData}
        setListData={setListData}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
      />
      <StocktakingReceiptTable
        listData={listData}
        setListData={setListData}
        toggleShowModal={handleToggleShowModal}
        setModalType={setModalType}
        setFormData={setFormData}
      />
    </>
  );
}

export { stocktakingInit, stocktakingInitItem };
export default StocktakingReceiptView;
