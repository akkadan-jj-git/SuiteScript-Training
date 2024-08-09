/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search', 'N/file'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search, file) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try{
                let soSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [
                        ['datecreated', 'within', 'thismonth'],
                        'AND',
                        ['mainline', 'is', 'T']
                    ],
                    columns: ['entity', 'email', 'tranid', 'total', 'salesrep']
                });

                soSearch.run().each(function(result){
                    let customer = result.getValue('entity');
                    let email = result.getValue('email');
                    let docNumber = result.getValue('tranid');
                    let amount = result.getValue('total');
                    let salesRep = result.getValue('salesrep');
                })
                
            }
            catch(e){

            }
        }

        return {execute}

    });
