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
            let custsearch = search.create({
                type: search.Type.CUSTOMER,
                filters: [
                    ['subsidiary', 'anyof', 1],
                    'AND',
                    ['stage', 'is', 'CUSTOMER'],
                    'AND',
                    ['datecreated', 'within', 'thismonth']
                ],
                columns: [
                    search.createColumn({ name: 'entityid', label: 'Customer Name' }),
                    search.createColumn({ name: 'subsidiary', label: 'Subsidiary' }),
                    search.createColumn({ name: 'salesrep', label: 'Sales Rep' }),
                    search.createColumn({ name: 'email', label: 'Email' }),
                    search.createColumn({ name: 'datecreated', label: 'Date Created' })
                ]
                
            });
            let results = custsearch.run().getRange({
                start: 0,
                end: 5
            });
            results.forEach(function(result) {
                let customer = {
                    name: result.getValue({name: 'entityid'}),
                    subsidiary: result.getText({name: 'subsidiary'}),
                    salesRep: result.getText({name: 'salesrep'}),
                    email: result.getValue({name: 'email'}),
                    dateCreated: result.getValue({name: 'datecreated'})
                };
                log.debug("name", customer.name);
                log.debug("subsidiary", customer.subsidiary);
                log.debug("salesrep", customer.salesRep);
                log.debug("email", customer.email);
                log.debug("datecreated", customer.dateCreated);
                });
                return true;
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
