/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/file', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (email, file, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let today = new Date();
            let firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            let lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ['datecreated', 'within', firstDayOfLastMonth, lastDayOfLastMonth],
                    'AND', 
                    ['mainline', 'is', 'T']
                ],
                columns: ['entity', 'tranid', 'total', 'salesrep']
            });

            let csvData, adminCsvData = 'Customer Name,Customer Email,Sales Order Number,Sales Amount\n';
            // let adminCsvData = 'Customer Name,Customer Email,Sales Order Number,Sales Amount\n';

            salesOrderSearch.run().each(function(result) {
                let customer = result.getValue('entity');
                let customerEmail = record.load({ type: record.Type.CUSTOMER, id: customer }).getValue('email');
                let documentNumber = result.getValue('tranid');
                let salesAmount = result.getValue('total');
                let salesRep = result.getValue('salesrep');

                let csvLine = customer + ',' + customerEmail + ',' + documentNumber + ',' + salesAmount + '\n';
                
                if (salesRep) {
                    csvData += csvLine;
                } else {
                    adminCsvData += csvLine;
                }

                return true;
            });

            // Create CSV file for sales reps
            let csvFile = file.create({
                name: 'sales_report.csv',
                fileType: file.Type.CSV,
                contents: csvData
            });
            csvFile.folder = -15;
            let fileId = csvFile.save();
            let fileObj = file.load({ id: fileId });

            // Email the CSV file to the respective sales reps
            if (csvData) {
                email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: getSalesRepsEmails(), // Function to fetch sales rep emails
                    subject: 'Monthly Sales Report',
                    body: 'Please find the attached sales report for the previous month.',
                    attachments: [csvFile]
                });
            }

            // Create CSV file for admin if necessary
            if (adminCsvData) {
                let adminCsvFile = file.create({
                    name: 'admin_sales_report.csv',
                    fileType: file.Type.CSV,
                    contents: adminCsvData
                });

                email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: 'admin@example.com', // Replace with actual admin email
                    subject: 'Monthly Sales Report - Customers without Sales Reps',
                    body: 'Some customers do not have assigned sales reps. Please find the attached report.',
                    attachments: [adminCsvFile]
                });
            }
        }

        return {execute}

    });
