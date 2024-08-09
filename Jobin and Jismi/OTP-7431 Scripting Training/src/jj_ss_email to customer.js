/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/email'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try {
                var searchObj = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [['companyname', 'startswith', 'xyz'], 'AND', ['subsidiary', 'is', 1]],
                    columns: ['internalid']
                }); 
                
                // var customerSearch = search.load({ id: searchObj });
                var senderId = -5;
    
                searchObj.run().each(function(result) {
                    // var customerId = result.id;
                    var customerId = result.getValue({ name: 'internalid' });
                    log.debug('Sender', senderId);
                    log.debug('Recipient', customerId);
                    email.send({
                        author: senderId,
                        recipients: customerId,
                        subject: 'Daily Sales Order Report',
                        body: 'Sales Order created'
                    });
                    
                    return true;
                });
                
            } catch (e) {
                log.error({ title: 'Error executing scheduled script', details: e });
            }
        }

        return {execute}

    });
