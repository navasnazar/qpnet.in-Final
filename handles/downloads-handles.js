let excelJs = require("exceljs")
let ordersdb = require('../config/ordersdb')

exports.OrderDetails = (req, res, next)=>{
    ordersdb.find()
                .then((SalesReport)=>{
                    console.log(SalesReport);
                    try {
                        const workbook = new excelJs.Workbook();
                        const worksheet = workbook.addWorksheet("Sales Report");

                        worksheet.columns = [
                        { header: "Sl No.", key: "s_no" },
                        { header: "OrderID", key: "_id" },
                        { header: "User ID", key: "userId" },
                        { header: "Date", key: "orderDate" },
                        { header: "Products", key: "prod" },
                        { header: "Payment Method", key: "paymentOption" },
                        { header: "status", key: "shippingStatus" },
                        { header: "Billing Amount", key: "checkoutAmount" },
                        ];
                        
                        let counter = 1;
                        
                        SalesReport.forEach((report) => {
                        report.s_no = counter;
                        report.prod = ""
                        report.items.forEach((eachProduct) => {
                            report.prod += eachProduct.prodName + ", " + eachProduct.prodPrice + ', ' + eachProduct.prodQty + ' || ';
                        });
                        worksheet.addRow(report);
                        counter++;
                        });

                        worksheet.getRow(1).eachCell((cell) => {
                        cell.font = { bold: true };
                        });
                        res.header(
                            "Content-Type",
                            "application/vnd.oppenxmlformats-officedocument.spreadsheatml.sheet"
                            );
                            res.header("Content-Disposition", "attachment; filename=report.xlsx");
                      
                            workbook.xlsx.write(res);
                        
                    } catch (err) {
                        console.log(err.message);
                    }
                    })
}