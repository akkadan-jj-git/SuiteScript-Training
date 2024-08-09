/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let objSearch = search.create(
                {
                    type: search.Type.INVOICE,
                    filters: [['mainline','is','T'], 'AND', ['status', 'is', 'CustInvc:A' ]],
                    columns: ['internalid','entity','tranid']
                });
                let searchResultSet = objSearch.run();
                let emailBody = "Invoices<br>";
                searchResultSet.each(function(searchResult)
                {
                    let internalId = searchResult.getValue({name :'internalid'});
                    log.debug('Internal Id', internalId);
                    let docNum = searchResult.getValue({name :'tranid'});
                    log.debug('Document Number', docNum);
                    let customerName = searchResult.getText({name :'entity'});
                    log.debug('Customer Name', customerName);
                    emailBody += "Document Number:" + docNum +" Customer Name:" + customerName +"<br>";
                    return true;
                });
                email.send(
                {
                    author: 30,
                    recipients: -5,
                    subject: "Invoice with open status",
                    body: emailBody
                });
            }
     
            return {execute}
     
        });
