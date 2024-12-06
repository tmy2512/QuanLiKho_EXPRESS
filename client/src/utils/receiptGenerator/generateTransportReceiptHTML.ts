import { iTransportReceiptProps } from "~/views/types";
import stringToDate from "../stringToDate";
import { QR_API_ROOT } from "~/constants";

const generateTransportReceiptHTML = (formData: iTransportReceiptProps) => {
    const qrObject = {
        idTransportReceipts: formData.idTransportReceipts,
        transportLength: formData.transportDetails.length,
    };
    const qrData = encodeURIComponent(JSON.stringify(qrObject));
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>PHIẾU ĐIỀU CHUYỂN KHO</title>
      <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            .table-content th, td {
                padding: 5px;
            }

            .header {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
            }

            .info {
                margin-bottom: 20px;
            }

            .info-2 {
                text-align: center;
            }

            .info p {
                margin-bottom: 5px;
            }

            .table-content {
                overflow-x: auto;
            }

            table {
                border-collapse: collapse;
                width: 100%;
              }
              
              .table-content table td, th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              
              .table-content table tr:nth-child(even) {
                background-color: #dddddd;
              }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <td>
                    <div class="info">
                        <p>Nhân viên xuất hàng: ${
                            formData.idUserSend2?.username
                        }</p>
                        <p>Địa chỉ kho xuất hàng: ${
                            formData.idWarehouseFrom2?.name
                        } - Số ${formData.idWarehouseFrom2?.address}</p>
                        <p>Tên người vận chuyển: </p>
                        <p>Phương tiện vận chuyển: ô tô tải BKS số: ${
                            formData.plateNumber
                        }</p>
                        <p>Mã số thuế người xuất hàng: </p>
                    </div>
                </td>
                <td>
                    <img src='${QR_API_ROOT}&data=${qrData}' />                
                </td>
            </tr>
        </table>
        <div class="header">
            PHIẾU XUÁT KHO KIÊM VẬN CHUYỂN NỘI BỘ
        </div>
        <p style="text-align: center"><i>Ngày ${stringToDate(
            formData.transportFromDate
        )}</i></p>
        <p>Nhân viên nhận hàng: ${formData.idUserReceive2?.username || ""}</p>
        <p>Địa điểm nhận hàng: ${formData.idWarehouseTo2?.name} - Số ${
        formData.idWarehouseTo2?.address
    }</p>
        <p>Mã số thuế: </p>
      <div class="table-content">
          <table>
            <thead>
                <tr>
                    <th>STT
                    <th>Mã đơn xuất</th>
                    <th>Mã phiếu xuất</th>
                <tr>
            </thead>
            <tbody>
            ${formData.transportDetails.map(
                (detail, index) =>
                    `
                <tr key=${index}>
                <td>${index + 1}</td>
                <td>${detail.idExportReceipt2?.idExportOrder}</td>
                <td>${detail.idExportReceipt}</td>
            </tr>
                `
            )}
            </tbody>
          </table>
      </div>
      <table class="footer" style="text-align: center">
            <tr>
                <td>
                </td>
                <td>
                    <p><b style="text-transform: uppercase">Thủ trưởng đơn vị</b>
                        <br/><i>(Chữ ký số)</i>
                        <br/>
                        Đã chứng thực
                    </p>
                </td>
            </tr>
        </table>
        <br/>
        <br/>
    </body>
  </html>
`;
    return html;
};

export default generateTransportReceiptHTML;
