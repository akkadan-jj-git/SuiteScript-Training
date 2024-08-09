/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/email', 'N/file'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email, file) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let searchObj = search.create({
                type: search.Type.CUSTOMER,
                filters: [['datecreated', 'within', 'thismonth']],
                columns: ['companyname','datecreated', 'salesrep']
            });
            let csvContent;
            let result = searchObj.run();
            log.debug('Search Result', result);
            result.each(function(searchResult){
                let customerName = searchResult.getValue('companyname');
                log.debug('Customer Name', customerName);
                let createdDate = searchResult.getValue('datecreated');
                log.debug('Created Date', createdDate);
                let salesRep = searchResult.getValue('salesrep');
                log.debug('Sales Rep', salesRep);
                csvContent += customerName + " " + createdDate + " " + salesRep;
                // return true;
            });
            let csvFile = file.create(
            {
                name: 'Customer Record-Monthly Report.csv',
                fileType: file.Type.CSV,
                contents: csvContent,
            });
            csvFile.folder = -15;
            let fileId = csvFile.save();
            let fileObj = file.load({ id: fileId });
            email.send({
                author: 30,
                recipients: -5,
                subject: "Monthly report - Customers Created",
                body: "Details of the customers created in this month are included in the CSV file attached.",
                attachments: [fileObj]
            });
        }

        return {execute}

    });
