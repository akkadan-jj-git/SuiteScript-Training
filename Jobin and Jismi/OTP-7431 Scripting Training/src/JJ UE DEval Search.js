/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
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
            var so = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ['status', 'is', 'SalesOrd:B'],
                    'AND',
                    ['mainline', 'is', 'T']
                ],
                columns: [
                    'tranid',
                    'trandate',
                    'entity',
                    'subsidiary',
                    'amount'
                ]
            });
            let results = so.run().getRange({
                start: 0,
                end: 5
            });
            results.forEach(function(result) {
                let sod = {
                    docno: result.getValue({name: 'tranid'}),
                    date: result.getValue({name: 'trandate'}),
                    name: result.getText({name: 'entity'}),
                    subs: result.getText({name: 'subsidiary'}),
                    amt: result.getValue({name: 'amount'})
                };
                log.debug("Document Number", sod.docno);
                log.debug("Date", sod.date);
                log.debug("Customer Name", sod.name);
                log.debug("Subsidiary", sod.subs);
                log.debug("Amount", sod.amt);
                return true;    
            });
                
            };
        

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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
