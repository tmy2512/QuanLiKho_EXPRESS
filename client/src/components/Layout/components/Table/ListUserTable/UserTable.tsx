import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iUserItemProps, iUserDataProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import UserTableRow from "./UserTableRow";

function UserTable(props: {
    listData: iUserItemProps[];
    setListData: Dispatch<SetStateAction<iUserItemProps[]>>;
    toggleShowModal: () => void;
    setModalType: Dispatch<SetStateAction<iModalTypes>>;
    setFormData: Dispatch<React.SetStateAction<iUserDataProps>>;
    setRole: Dispatch<React.SetStateAction<number>>;
}) {
    const {
        listData,
        setListData,
        toggleShowModal,
        setModalType,
        setFormData,
        setRole,
    } = props;
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ và tên</th>
                    <th>Username</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {listData.length &&
                    listData.map((item, index) => (
                        <UserTableRow
                            key={item.idUsers}
                            item={item}
                            index={index}
                            setListData={setListData}
                            toggleShowModal={toggleShowModal}
                            setModalType={setModalType}
                            setFormData={setFormData}
                            setRole={setRole}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default memo(UserTable);
