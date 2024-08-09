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
            let invsearch = search.create({
                type: search.Type.INVOICE,
                filters: [
                    ['subsidiary', 'anyof', 1],
                    'AND',
                    ['status', 'is', 'CustInvc:A']
                ],
                columns: [
                    search.createColumn({ name: 'tranid', label: 'Document Number' }),
                    search.createColumn({ name: 'trandate', label: 'Date' }),
                    search.createColumn({ name: 'entity', label: 'Customer Name' }),
                    search.createColumn({ name: 'email', join: 'customer', label: 'Customer Email' }),
                    search.createColumn({ name: 'amount', label: 'Amount' })
                ]
                
            });

            var count = 0;

            invsearch.run().each(function(result) {
                count++;
                return true; // continue to next result
            });

            let results = invsearch.run().getRange({
                start: 0,
                end: count
            });

            results.forEach(function(result) {
                let inv = {
                    doc: result.getValue('tranid'),
                    date: result.getValue('trandate'),
                    cname: result.getText('entity'),
                    cmail: result.getValue({ name: 'email', join: 'customer' }),
                    amt: result.getValue('amount')
                };
                log.debug("Document Number", inv.doc);
                log.debug("Date", inv.date);
                log.debug("Customera Name", inv.cname);
                log.debug("Customer Email", inv.cmail);
                log.debug("Amount", inv.amt);
                log.debug("Count of Invoices", count);
                });
                return true; // continue to next result
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
