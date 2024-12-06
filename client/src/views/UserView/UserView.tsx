import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getAllUser } from "~/apis/userAPI";
import UserModal from "~/components/Layout/components/Modal/UserModal";
import { iModalTypes } from "~/components/Layout/components/Modal/types";
import UserTable from "~/components/Layout/components/Table/ListUserTable/UserTable";
import { getCookie } from "~/utils/cookies";
import { iUserDataProps, iUserItemProps } from "~/views/types";

const managerId = getCookie("id") || 1;
const initialUserDataState: iUserDataProps = {
  name: "",
  email: "",
  gender: "",
  phone: "",
  startDate: "",
  username: "",
  password: "",
  idCreated: +managerId,
  disabled: 0,
  idPermissions: [],
};

function UserView() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<iModalTypes>({ type: "create" });
  const [listData, setListData] = useState<iUserItemProps[]>([
    {
      name: "",
      idUsers: 1,
      username: "",
      disabled: 0,
    },
  ]);
  const [formData, setFormData] =
    useState<iUserDataProps>(initialUserDataState);
  const [role, setRole] = useState(0);

  const handleSetListData = useCallback(() => {
    getAllUser().then((data) => data && setListData(data));
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
      <h2>Danh sách nhân viên</h2>

      <Button onClick={handleToggleShowModal} className="my-3">
        <i className="fa-solid fa-plus"></i>
        &nbsp; Thêm mới
      </Button>

      <UserModal
        show={showModal}
        onHide={handleToggleShowModal}
        listData={listData}
        setListData={setListData}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
        role={role}
        setRole={setRole}
      />

      <UserTable
        listData={listData}
        setListData={setListData}
        toggleShowModal={handleToggleShowModal}
        setModalType={setModalType}
        setFormData={setFormData}
        setRole={setRole}
      />
    </>
  );
}

export { initialUserDataState };
export default UserView;
