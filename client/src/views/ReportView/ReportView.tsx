import { ChangeEvent, useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import { filterExportReceiptsByDate } from "~/apis/exportReceiptAPI";
import { getAllGoods } from "~/apis/goodsAPI";
import { filterImportReceiptsByDate } from "~/apis/importReceiptAPI";
import { filterStocktakingReceiptsByDate } from "~/apis/stocktakingReceiptAPI";
import useGlobalState from "~/hooks/useGlobalState";
import formatPeriodDate from "~/utils/formatPeriodDate";
import generateReportHTML from "~/utils/receiptGenerator/generateReportHTML";
import { iReport, iReportDetail } from "../types";

const initReport: iReport = {
  startDate: "",
  endDate: "",
  goods: [],
  importReceipts: [],
  exportReceipts: [],
  stocktakingReceipts: [],
  reportDetails: [],
  userCreated: "",
};

function ReportView() {
  const [reportPeriod, setReportPeriod] = useState("");
  const [formData, setFormData] = useState(initReport);
  const { state } = useGlobalState();
  const { name } = state;

  useEffect(() => {
    const { startDate, endDate } = formatPeriodDate(1);
    setReportPeriod("1");

    setFormData((prev) => {
      return {
        ...prev,
        startDate,
        endDate,
        userCreated: name,
      };
    });
  }, []);

  const handleChangePeriod = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const { startDate, endDate } = formatPeriodDate(+value);
    setFormData((prev) => {
      return {
        ...prev,
        startDate,
        endDate,
      };
    });
    setReportPeriod(e.target.value);
  };

  const handleGenerate = async () => {
    const goodsList = await getAllGoods();
    const importReceipts = await filterImportReceiptsByDate(
      formData.startDate,
      formData.endDate
    );
    const exportReceipts = await filterExportReceiptsByDate(
      formData.startDate,
      formData.endDate
    );
    const stocktakingReceipts = await filterStocktakingReceiptsByDate(
      formData.startDate,
      formData.endDate
    );
    if (!goodsList || !importReceipts || !stocktakingReceipts || !exportReceipts) return

    const reportData = goodsList.map((goods) => {
      let returnedData: iReportDetail = {
        idGoods: goods.idGoods,
        name: goods.name,
        unit: goods.idUnit2?.name || "",
        beginningAmount: 0,
        importedAmount: 0,
        exportedAmount: 0,
        endedAmount: 0,
      };
      const matchedImports = importReceipts.filter((receipt) =>
        receipt.idImportOrder2.importOrderDetails.find(
          (order) => order.idGoods2.idGoods === goods.idGoods
        )
      );
      const matchedExports = exportReceipts.filter((receipt) =>
        receipt.idExportOrder2.exportOrderDetails.find(
          (order) => order.idGoods2.idGoods === goods.idGoods
        )
      );
      const matchedStocktakings = stocktakingReceipts.filter((receipt) =>
        receipt.stocktakingDetails.find(
          (detail) => detail.idGoods2.idGoods === goods.idGoods
        )
      );

      if (matchedImports) {
        let importAmount = 0;
        for (const receipt of matchedImports) {
          for (const detail of receipt.idImportOrder2
            .importOrderDetails) {
            if (detail.idGoods2.idGoods === goods.idGoods) {
              importAmount += detail.amount;
            }
          }
        }
        returnedData = {
          ...returnedData,
          importedAmount: importAmount,
        };
      }
      if (matchedExports) {
        let exportAmount = 0;
        for (const receipt of matchedExports) {
          for (const detail of receipt.idExportOrder2
            .exportOrderDetails) {
            if (detail.idGoods2.idGoods === goods.idGoods) {
              exportAmount += detail.amount;
            }
          }
        }
        returnedData = {
          ...returnedData,
          exportedAmount: exportAmount,
        };
      }
      if (matchedStocktakings) {
        let stocktakingAmount = 0;
        if (matchedStocktakings.length > 0) {
          for (const detail of matchedStocktakings[0]
            .stocktakingDetails) {
            if (detail.idGoods2.idGoods === goods.idGoods) {
              stocktakingAmount = detail.storedAmount;
            }
          }
          returnedData = {
            ...returnedData,
            beginningAmount: stocktakingAmount,
          };
        }
      }

      const endedAmount =
        returnedData.beginningAmount +
        returnedData.importedAmount -
        returnedData.exportedAmount;

      returnedData = {
        ...returnedData,
        endedAmount: endedAmount,
      };

      return returnedData;
    });
    setFormData((prev) => {
      return {
        ...prev,
        reportDetails: reportData,
      };
    });
  };

  const handlePrint = () => {
    const html = generateReportHTML(formData);
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  return (
    <>
      <h2 className="mb-3">Báo cáo quyết toán nhập - xuất - tồn kho</h2>
      <Form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <Row className="g-2">
          <FloatingLabel
            as={Col}
            label="Chọn kỳ lập báo cáo"
            className="mb-3"
          >
            <Form.Select
              value={reportPeriod}
              onChange={handleChangePeriod}
            >
              <optgroup label="Kỳ này">
                <option value="1">Tháng này</option>
                <option value="2">Quý này</option>
                <option value="3">Năm nay</option>
              </optgroup>
              <optgroup label="Kỳ trước">
                <option value="4">Tháng trước</option>
                <option value="5">Quý trước</option>
                <option value="6">Năm trước</option>
              </optgroup>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="Từ ngày" as={Col} className="mb-3">
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel label="Đến ngày" as={Col} className="mb-3">
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              readOnly
            />
          </FloatingLabel>
        </Row>
        <Row className="g-2">
          <Col>
            <Button className="me-3" onClick={handleGenerate}>
              Tạo báo cáo
            </Button>
            {formData.reportDetails.length ? (
              <Button variant="success" onClick={handlePrint}>
                In báo cáo
              </Button>
            ) : null}
          </Col>
        </Row>
      </Form>
      <hr />
      {formData.reportDetails.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Tên hàng</th>
              <th>ĐVT</th>
              <th>Lượng tồn đầu kỳ</th>
              <th>Lượng nhập trong kỳ</th>
              <th>Lượng xuất kho sản xuất</th>
              <th>Lượng tồn cuối kỳ</th>
            </tr>
          </thead>
          <tbody>
            {formData.reportDetails.map((detail, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{detail.idGoods}</td>
                <td>{detail.name}</td>
                <td>{detail.unit}</td>
                <td>{detail.beginningAmount}</td>
                <td>{detail.importedAmount}</td>
                <td>{detail.exportedAmount}</td>
                <td>{detail.endedAmount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </>
  );
}

export default ReportView;
