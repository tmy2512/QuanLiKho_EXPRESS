import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { findGoods, getAllGoods } from "~/apis/goodsAPI";
import GoodsModal from "~/components/Layout/components/Modal/GoodsModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import SearchBar from "~/components/Layout/components/Searchbar/Searchbar";
import GoodsTable from "~/components/Layout/components/Table/GoodsListTable/GoodsTable";
import { iGoodsItemProps, iGoodsProps, iGoodsTypeProps } from "../types";
import { getAllGoodsTypes } from "~/apis/goodsTypeAPI";
import useRole from "~/hooks/useRole";
import { ROLE_ID } from "~/constants/roles";

const initGoodsItem: iGoodsItemProps = {
  idGoods: 0,
  name: "",
  exp: "",
  amount: 0,
  disabled: 0,
  isHeavy: false,
};
const initGoodsInfo: iGoodsProps = {
  idGoods: 0,
  idType: 0,
  idUnit: 0,
  idWarehouse: 0,
  name: "",
  floor: 0,
  slot: 0,
  importDate: "",
  exp: "",
  amount: 0,
  idCreated: 0,
  usernameCreated: "",
  createdAt: new Date(),
  disabled: 0,
  isHeavy: false,
};

function GoodsView() {
  const params = useParams();
  const action = params.action;
  const initShowModal = action ? true : false;
  const [showModal, setShowModal] = useState(initShowModal);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iGoodsItemProps[]>([
    initGoodsItem,
  ]);
  const [formData, setFormData] = useState<iGoodsProps>(initGoodsInfo);
  const [goodsTypes, setGoodsTypes] = useState<iGoodsTypeProps[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const role = useRole();

  const handleSetListData = useCallback(() => {
    getAllGoods().then((data) => data && setListData(data));
  }, []);

  useEffect(() => {
    handleSetListData();
  }, [handleSetListData]);

  useEffect(() => {
    getAllGoodsTypes().then((data) => {
      data && data.length && setGoodsTypes(data);
    });
  }, []);

  const handleToggleShowModal = useCallback(() => {
    setShowModal(!showModal);
    setModalType({ type: "create" });
  }, [showModal]);

  const handleChangeInputSearch = _.debounce(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      switch (e.target.name) {
        case "q":
          setQuery(e.target.value);
          break;
        case "Loại hàng":
          setType(e.target.value);
          break;
      }
    },
    1000
  );

  useEffect(() => {
    !query && !type
      ? handleSetListData()
      : findGoods(query, type).then((data) => setListData(data));
  }, [query, type]);

  return (
    <>
      <h2>Danh sách hàng hoá</h2>
      {(role === ROLE_ID.ASSURANCE_3 || role === ROLE_ID.CEO_6) && (
        <>
          <Button
            onClick={handleToggleShowModal}
            className="mt-1 mb-3 me-3"
          >
            <i className="fa-solid fa-plus"></i>
            &nbsp; Thêm mặt hàng mới
          </Button>
          <Link to={"/list/import-orders"}>
            <Button className="mt-1 mb-3 me-3">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              &nbsp; Đặt đơn nhập kho mới
            </Button>
          </Link>
        </>
      )}
      <SearchBar
        onChange={handleChangeInputSearch}
        filterList={[
          {
            title: "Loại hàng",
            list: goodsTypes.map((type) => {
              return {
                label: type.name,
                value: type.idGoodsTypes,
              };
            }),
          },
        ]}
      />
      <GoodsModal
        show={showModal}
        onHide={handleToggleShowModal}
        listData={listData}
        setListData={setListData}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
      />
      <GoodsTable
        listData={listData}
        setListData={setListData}
        toggleShowModal={handleToggleShowModal}
        setModalType={setModalType}
        setFormData={setFormData}
      />
    </>
  );
}

export { initGoodsInfo, initGoodsItem };
export default GoodsView;
