/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/record', 'N/search', 'N/runtime'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search, runtime) => {
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
            let newSO = scriptContext.newRecord;
            let customer = newSO.getValue('entity');
            // let custId = newSO.getText('entity');
            let salesRepId = newSO.getValue('salesrep');
            let currentUser = runtime.getCurrentUser();
            let sender = currentUser.id;
            log.debug('Customer', customer);
            // let customerFields = search.lookupFields({
            //     type: search.Type.CUSTOMER,
            //     id: customer,
            //     columns: ['salesrep']
            // // });
            // let salesRepId = customerFields.salesrep;
            log.debug('Sales Rep', salesRepId);
            if(salesRepId){
                if(scriptContext.type !== scriptContext.UserEventType.CREATE){
                    let sosearch = search.create({
                        type: search.Type.SALES_ORDER,
                        filters: [
                            ['entity', 'anyof', newSO.getValue('entity')],
                            'AND',
                            ['status', 'noneof', ['SalesOrd:C', 'SalesOrd:G', 'SalesOrd:H']]
                        ],
                        columns: [
                            search.createColumn({ name: 'entity', label: 'Customer Name' })
                        ]
                    });
                    let resultSet = sosearch.run();
                    let results = resultSet.getRange({
                        start: 0,
                        end: 1000 
                        
                    });
                    var openSO = results.length;
                    log.debug('Number of Open Sales Orders', openSO);
                    if(openSO > 5){
                        email.send({
                            author: sender,
                            recipients: salesRepId,
                            subject: 'New Sales Order by a customer already havinf Open Sales Order',
                            body: 'Customer Id: ' + customer + '\nCustomer Name: ' + '\nExisting Open Sales Orders: ' + openSO
                        });
                    }
                }
                else{
                    return;
                }
            }
            else{
                return;
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
