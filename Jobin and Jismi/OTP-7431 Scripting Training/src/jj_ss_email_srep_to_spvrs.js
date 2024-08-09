/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, runtime, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let salesOrderSearch = search.load({
                id: 'customsearch_jj_so_mail_rep_spvsr'
            });
     
            let salesOrderResults = salesOrderSearch.run().getRange({
                start: 0,
                end: 1000
            });
     
            salesOrderResults.forEach(result => {
                let salesRepId = result.getValue({name: 'salesrep'});
                let salesRepRecord = record.load({
                    type: record.Type.EMPLOYEE,
                    id: salesRepId
                });
     
                log.debug("Sales Rep",salesRepId);
                let supervisorId = salesRepRecord.getValue({fieldId: 'supervisor'});
                log.debug("Supervisior",supervisorId);
                let supervisorRecord = record.load({
                    type: record.Type.EMPLOYEE,
                    id: supervisorId
                });
                let supervisorEmail = supervisorRecord.getValue({fieldId: 'email'});
                log.debug(`supervisior email ${supervisorEmail}`)
     
                let emailBody = 'Sales Order for the Previous Month:';
                emailBody += 'Transaction Id :' + result.getValue({
                    name : 'tranid'
                }) + '<br/>';
     
                emailBody += 'Date :' + result.getValue({
                    name : 'trandate'
                }) +'<br/>';
     
                emailBody += 'Customer :' + result.getText({
                    name : 'entity'
                }) + '<br/>';
     
                emailBody += 'Memo :' + result.getText({
                    name : 'memo'
                }) + '<br/>';
     
                emailBody += 'Sales Rep :' + result.getText({
                    name : 'salesrep'
                }) + '<br/>';
     
                emailBody += 'Amount :' + result.getValue({
                    name : 'total'
                }) + '<br/>';

                email.send({
                    author: salesRepId,
                    recipients: supervisorEmail,
                    subject: 'Previous Month Sales Orders',
                    body: emailBody
                });
            });
        };
        return {execute};
    });
