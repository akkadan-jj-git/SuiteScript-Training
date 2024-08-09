/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {
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
                type: record.Type.CUSTOMER,
                filter:[],
                columns:['internalid', 'entityid', 'datecreated']
            });
            let result = custsearch.run().getRange({
                start: 0,
                end: 50
            });
            
            // log.debug('Number of Customers', result);

            result.forEach(function(results){
                let custObj = {
                    internalId: results.getValue({name: 'internalid'}),
                    name: results.getValue({name: 'entityid'}),
                    dateCreated: results.getValue({name: 'datecreated'}),
                    snfield: results.getValue({name: 'custentity_jj_customer_shortname'})
                };
                // log.debug("Name", custObj.dateCreated);
                let shortName1 = custObj.name.substring(0, 2);
                // log.debug("Short Name", shortName1);
                let dateObj = new Date(custObj.dateCreated);
                let month = dateObj.getMonth() + 1;
                // log.debug("Month", month);
                let shortName2 = shortName1 + ': ' + month;
                // log.debug("Short Name", shortName2);
                let cLoad = record.load({
                    type: record.Type.CUSTOMER,
                    id: custObj.internalId
                });
                cLoad.setValue({
                    fieldId: 'custentity_jj_customer_shortname',
                    value: shortName2
                });
                cLoad.save();
            });

            return true;
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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
