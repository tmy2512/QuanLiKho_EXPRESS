import { Dispatch, SetStateAction, memo } from "react";
import { Table } from "react-bootstrap";
import { iExportReceiptItemProps, iExportReceiptProps } from "~/views/types";
import { iModalTypes } from "../../Modal/types";
import ExportReceiptTableRow from "./ExportReceiptTableRow";

function ExportReceiptTable(props: {
  tabKey: "in-process" | "finished" | "failed" | string;
  listData: iExportReceiptItemProps[];
  setListData: Dispatch<SetStateAction<iExportReceiptItemProps[]>>;
  toggleShowModal: () => void;
  setModalType: Dispatch<SetStateAction<iModalTypes>>;
  setFormData: Dispatch<React.SetStateAction<iExportReceiptProps>>;
}) {
  const { listData, tabKey } = props;
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID phiếu xuất</th>
          <th>ID đơn xuất</th>
          <th>Kho xuất</th>
          <th>Ngày xuất</th>
        </tr>
      </thead>
      <tbody>
        {listData && listData.length &&
          listData.map((item, index) => (
            <ExportReceiptTableRow
              key={item.idExportReceipts}
              item={item}
              index={index}
              {...props}
            />
          ))}
      </tbody>
    </Table>
  );
}

export default memo(ExportReceiptTable);
