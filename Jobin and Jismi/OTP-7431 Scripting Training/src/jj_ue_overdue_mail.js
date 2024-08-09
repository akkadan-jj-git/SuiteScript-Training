/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/email', 'N/runtime'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email, runtime) => {
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
         * @since 2015.2Ū
         */
        const beforeSubmit = (scriptContext) => {

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
            if(scriptContext.type !== scriptContext.UserEventType.CREATE){
                return;
            }
            let so = scriptContext.newRecord;
            let custId = so.getValue('entity');
            let salrep = so.getValue('salesrep');
            let recId = so.getValue('id');
            log.debug('Customer Id', custId);
            log.debug('Sales Rep Id', salrep);
            log.debug('Record Internal ID', recId);
            let customerFields = search.lookupFields({
                type: search.Type.CUSTOMER,
                id: custId,
                columns: ['entityid','overduebalance', 'salesrep']
            });
            let ovdamount = customerFields.overduebalance;
            let custname = customerFields.entityid;
            log.debug('Overdue Amount', ovdamount);
            log.debug('Customer Name', custname);
            if(ovdamount > 0){
                let salesrepFields = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: salrep,
                    columns: ['supervisor']
                });
                let currentUser = runtime.getCurrentUser();
                let sender = currentUser.id;
                log.debug('Sender', sender);
                let salesMngrId = salesrepFields.supervisor[0].value;
                log.debug('Recipient', salesMngrId);
                email.send({
                    author: sender,
                    recipients: salesMngrId,
                    subject: 'New Sales Order by an Overdue Customer',
                    body: '\nRecord Id: ' + recId + '\nCustomer Id: ' + custId + '\nCustomer Name: ' + custname + '\nOverdue Amount: ' + ovdamount
                });
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
