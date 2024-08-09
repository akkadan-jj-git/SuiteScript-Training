/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            if (scriptContext.type !== scriptContext.UserEventType.CREATE) {
                return;
            }
            var nrec = scriptContext.newRecord;

            var customerId = nrec.getValue('entity');
            log.debug('Customer ID', customerId);
            var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId
            });

            let salesRep = customerRecord.getText('salesrep');
            log.debug('Sales Rep', salesRep);
            if(salesRep){
                nrec.setText('custbody_jj_cust_salesrep',salesRep);
            }
            else{
                nrec.setText('custbody_jj_cust_salesrep',"No Sales Rep for this Customer");
            }
            
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
           
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
