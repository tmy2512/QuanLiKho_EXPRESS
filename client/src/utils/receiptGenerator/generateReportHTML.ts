import { iReport } from "~/views/types";

const generateReportHTML = (formData: iReport) => {
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>BÁO CÁO QUYẾT TOÁN NHẬP-XUẤT-TỒN KHO</title>
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
                        <p>Tên tổ chức: Công ty Chuyển phát nhanh SPX Express</p>
                        <p>Địa chỉ: 386 Đường Nguyễn Văn Linh, Quận Long Biên, TP. Hà Nội</p>
                        <p>Mã số thuế: </p>
                    </div>
                </td>
                <td>
                    <div class="info-2">
                        <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                        <p>Độc lập - Tự do - Hạnh phúc</p>
                        <p>----------</p>
                    </div>                  
                </td>
            </tr>
        </table>
        <div class="header">
            BÁO CÁO QUYẾT TOÁN NHẬP XUẤT TỒN KHO
        </div>
        <p style="text-align: center"><i>Kỳ báo cáo: Từ ngày ${
            formData.startDate
        } đến ngày ${formData.endDate}</i></p>
      <div class="table-content">
          <table>
            <thead>
                <tr>
                    <th>STT
                    <th>Mã hàng</th>
                    <th>Tên hàng</th>
                    <th>Đơn vị tính</th>
                    <th>Lượng tồn kho đầu kỳ</th>
                    <th>Lượng nhập trong kỳ</th>
                    <th>Lượng xuất kho</th>
                    <th>Lượng tồn kho cuối kỳ</th>
                <tr>
            </thead>
            <tbody>
            ${formData.reportDetails.map(
                (detail, index) =>
                    `
                <tr key=${index}>
                <td>${index + 1}</td>
                <td>${detail.idGoods}</td>
                <td>${detail.name}</td>
                <td>${detail.unit}</td>
                <td>${detail.beginningAmount}</td>
                <td>${detail.importedAmount}</td>
                <td>${detail.exportedAmount}</td>
                <td>${detail.endedAmount}</td>
            </tr>
                `
            )}
            </tbody>
          </table>
      </div>
      <table class="footer" style="text-align: center">
            <tr>
                <td><p><b style="text-transform: uppercase">Người lập</b> <br/>(Ký, ghi rõ họ tên)
                <br/>
                <br/>
                <br/>
                ${formData.userCreated}
                </p>
                </td>
                <td>
                    <p><b style="text-transform: uppercase">Người đại diện theo pháp luật của tổ chức cá nhân</b>
                        <br/>(Ký, đóng dấu, ghi rõ họ tên)
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

export default generateReportHTML;
