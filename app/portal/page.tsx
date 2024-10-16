"use client";
import WebBuilder from "../ui/outstanding_email_template_editor";

const initialTemplate = `   
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Outstanding Balance Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #4CAF50;
            font-size: 24px;
            text-align: center;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        table,
        th,
        td {
            border: 1px solid #ddd;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }

        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Outstanding Balance Notification</h1>
        <p>To {{.PartyName}},</p>
        <p>Address: {{.Address}}</p>
        <p>This is a reminder that you have an outstanding balance with us. Please review the details below:</p>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Bill Date</th>
                        <th>Bill Number</th>
                        <th>Bill Amount</th>
                        <th>Due Date</th>
                        <th>Delay Days</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .Bills}}
                    <tr>
                        <td class="date">{{.BillDate}}</td>
                        <td>{{.BillName}}</td>
                        <td class="amount">{{.AmountStr}}</td>
                        <td class="date">{{.DueDate}}</td>
                        <td class="amount">{{.DelayDays}}</td>
                    </tr>
                    {{end}}
                </tbody>
                <tfoot>
                        <td></td>
                        <td>Total</td>
                        <td class="amount">{{.TotalAmountStr}}</td>
                        <td></td>
                        <td></td>
                </tfoot>
            </table>
        </div>

        <p>Please make the payment by the due date to avoid any late fees.</p>
        <p>If you have already made the payment, please disregard this email.</p>

        <p>Thank you for your prompt attention to this matter.</p>

        <div class="footer">
            <p>Best Regards,<br>SoftGen Solutions LLP</p>
            <p><a href="https://softgensolution.in">Visit our website</a></p>
        </div>
    </div>

    <script>

        // Apply date formatting to all elements with the class 'date'
        document.querySelectorAll('.date').forEach(function (element) {
            var dateStr = element.textContent;
            element.textContent = formatDate(dateStr);
        });

        // Function to format a number as currency in INR
        function formatCurrency(amount) {
            return '₹' + amount.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        }

        // Apply formatting to all elements with the class 'amount'
        document.querySelectorAll('.amount').forEach(function (element) {
            var amount = parseFloat(element.textContent.replace(/₹|,/g, ''));
            if (!isNaN(amount)) {
                element.textContent = formatCurrency(amount);
            }
        });
    </script>
</body>

</html>

`;

const Page = () => {
  return (
    <div className="w-full h-[100vh] p-1">
      <WebBuilder
        initialTemplate={initialTemplate}
        onExtract={(htmlTemplate: string) => {}}
      />
    </div>
  );
};

export default Page;
