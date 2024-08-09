/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/runtime', 'N/search', 'N/render', 'N/email'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search, render, email) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try {
    
                let objSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [['mainline','is','T'], 'AND', ['trandate', 'on', 'today' ]],
                    columns: ['internalid','entity']
                });
                let searchResultSet = objSearch.run();
                log.debug("Search result", searchResultSet);
        
                searchResultSet.each(function(searchResult){
                    let salesOrderId = searchResult.getValue('internalid');
                    log.debug("Sales Order Id", salesOrderId);
        
        
                    let customerId = searchResult.getValue('entity');
                    log.debug("Customer Id", customerId);
        
                    let customerName = searchResult.getText('entity');
                    log.debug("Customer Name", customerName);
                    
                    record.load({
                        type: record.Type.SALES_ORDER,
                        id: salesOrderId
                    });
                    let soId = parseInt(salesOrderId);
                    let recPdf = render.transaction({
                        entityId: soId,
                        printMode: render.PrintMode.PDF,
                        inCustLocale: false
                    });
        
                    email.send({
                        author: -5,
                        recipients: customerId,
                        subject: "Sales Order Created",
                        body: "Hello "+ customerName +". Sales Order is created with id: "+ salesOrderId,
                        attachments: [recPdf]
                    });
                    return true;
                });
            }catch (e) {
                log.error({
                    title: 'Error in Scheduled Script',
                    details: e.message
                });
            }
        }

        return {execute}

    });
