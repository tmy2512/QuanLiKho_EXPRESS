import { useCallback, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { getAllGoodsGroups } from "~/apis/goodsGroupAPI";
import { getAllGoodsTypes } from "~/apis/goodsTypeAPI";
import { getAllGoodsUnits } from "~/apis/goodsUnitAPI";
import GoodsGroupModal from "~/components/Layout/components/Modal/GoodsGroupModal";
import GoodsTypeModal from "~/components/Layout/components/Modal/GoodsTypeModal";
import GoodsUnitModal from "~/components/Layout/components/Modal/GoodsUnitModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import GoodsGroupTable from "~/components/Layout/components/Table/GoodsGroupListTable/GoodsGroupTable";
import GoodsTypeTable from "~/components/Layout/components/Table/GoodsTypeListTable/GoodsTypeTable";
import GoodsUnitTable from "~/components/Layout/components/Table/GoodsUnitListTable/GoodsUnitTable";
import { ROLE_ID } from "~/constants/roles";
import useRole from "~/hooks/useRole";

import { getCookie } from "~/utils/cookies";
import {
  iGoodsGroupProps,
  iGoodsTypeProps,
  iGoodsUnitProps,
} from "~/views/types";

const initGoodsGroupData: iGoodsGroupProps = {
  idGoodsGroups: 0,
  name: "",
  deletedAt: new Date(),
};

const initGoodsUnitData: iGoodsUnitProps = {
  idGoodsUnits: 0,
  name: "",
  deletedAt: new Date(),
};
const initGoodsTypeData: iGoodsTypeProps = {
  idGoodsTypes: 0,
  idGoodsGroup: 0,
  idGoodsGroup2: initGoodsGroupData,
  name: "",
  deletedAt: new Date(),
};

function GoodsPropsView() {
  //SHARED PROPS
  const [key, setKey] = useState("goods-groups");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const role = useRole();

  //GOODS GROUPS
  const [groupListData, setGroupListData] = useState<iGoodsGroupProps[]>([
    initGoodsGroupData,
  ]);
  const [groupFormData, setGroupFormData] =
    useState<iGoodsGroupProps>(initGoodsGroupData);
  //GOODS UNITS
  const [unitListData, setUnitListData] = useState<iGoodsUnitProps[]>([
    initGoodsUnitData,
  ]);
  const [unitFormData, setUnitFormData] =
    useState<iGoodsUnitProps>(initGoodsUnitData);
  //GOODS TYPES
  const [typeListData, setTypeListData] = useState<iGoodsTypeProps[]>([
    initGoodsTypeData,
  ]);
  const [typeFormData, setTypeFormData] =
    useState<iGoodsTypeProps>(initGoodsTypeData);

  //HANDLER
  const handleSetListData = useCallback(() => {
    const jwt = getCookie("jwt");
    if (jwt) {
      switch (key) {
        case "goods-groups":
          getAllGoodsGroups().then((data) => data && setGroupListData(data));
          break;
        case "goods-units":
          getAllGoodsUnits().then((data) => data && setUnitListData(data));
          break;
        case "goods-types":
          getAllGoodsTypes().then((data) => data && setTypeListData(data));
          break;
      }
    }
  }, [key]);

  useEffect(() => {
    handleSetListData();
  }, [handleSetListData]);

  const handleToggleShowModal = () => {
    setShowModal(!showModal);
    setModalType({ type: "create" });
  };

  return (
    <>
      <h2>Danh sách các thuộc tính hàng hoá</h2>

      <Tabs
        defaultActiveKey="goods-groups"
        activeKey={key}
        id="fill-tabs"
        className="my-3"
        variant="pills"
        fill
        justify
        onSelect={(key) => {
          key && setKey(key);
        }}
      >
        <Tab eventKey="goods-groups" title="Nhóm hàng">
          {key === "goods-groups" && (
            <>
              {(role === ROLE_ID.ASSURANCE_3 ||
                role === ROLE_ID.CEO_6) && (
                  <Button
                    onClick={handleToggleShowModal}
                    className="my-3"
                  >
                    <i className="fa-solid fa-plus"></i>
                    &nbsp; Thêm mới
                  </Button>
                )}

              <GoodsGroupModal
                show={showModal}
                onHide={handleToggleShowModal}
                listData={groupListData}
                setListData={setGroupListData}
                modalType={modalType}
                formData={groupFormData}
                setFormData={setGroupFormData}
              />

              <GoodsGroupTable
                listData={groupListData}
                setListData={setGroupListData}
                toggleShowModal={handleToggleShowModal}
                setModalType={setModalType}
                setFormData={setGroupFormData}
              />
            </>
          )}
        </Tab>
        <Tab eventKey="goods-types" title="Loại hàng">
          {key === "goods-types" && (
            <>
              {(role === ROLE_ID.ASSURANCE_3 ||
                role === ROLE_ID.CEO_6) && (
                  <Button
                    onClick={handleToggleShowModal}
                    className="my-3"
                  >
                    <i className="fa-solid fa-plus"></i>
                    &nbsp; Thêm mới
                  </Button>
                )}

              <GoodsTypeModal
                show={showModal}
                onHide={handleToggleShowModal}
                typeListData={typeListData}
                groupListData={groupListData}
                setListData={setTypeListData}
                modalType={modalType}
                formData={typeFormData}
                setFormData={setTypeFormData}
              />

              <GoodsTypeTable
                listData={typeListData}
                setListData={setTypeListData}
                toggleShowModal={handleToggleShowModal}
                setModalType={setModalType}
                setFormData={setTypeFormData}
              />
            </>
          )}
        </Tab>
        <Tab eventKey="goods-units" title="Đơn vị tính">
          {key === "goods-units" && (
            <>
              {(role === ROLE_ID.ASSURANCE_3 ||
                role === ROLE_ID.CEO_6) && (
                  <Button
                    onClick={handleToggleShowModal}
                    className="my-3"
                  >
                    <i className="fa-solid fa-plus"></i>
                    &nbsp; Thêm mới
                  </Button>
                )}

              <GoodsUnitModal
                show={showModal}
                onHide={handleToggleShowModal}
                listData={unitListData}
                setListData={setUnitListData}
                modalType={modalType}
                formData={unitFormData}
                setFormData={setUnitFormData}
              />

              <GoodsUnitTable
                listData={unitListData}
                setListData={setUnitListData}
                toggleShowModal={handleToggleShowModal}
                setModalType={setModalType}
                setFormData={setUnitFormData}
              />
            </>
          )}
        </Tab>
      </Tabs>
    </>
  );
}

export { initGoodsGroupData, initGoodsUnitData, initGoodsTypeData };
export default GoodsPropsView;
