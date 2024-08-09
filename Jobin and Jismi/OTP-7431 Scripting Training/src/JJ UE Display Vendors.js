/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/search'],
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
            let objRec = record.create(
                {
                    type: record.Type.VENDOR,
                    isDynamic: true
                });
                objRec.setValue(
                {
                    fieldId : 'companyname',
                    value : "CC4 Vendor",
                    ignoreFiledChange: true
                });
                objRec.setValue('subsidiary', 1);
                objRec.setValue('phone', 750184585);
                objRec.setValue('email', "cc4.vendor1@xyz.com");
                objRec.save();
            let objSearch = search.create(
            {
                type: search.Type.VENDOR,
                columns: ['companyname' , 'subsidiary']
            });
            var searchresultset = objSearch.run();
            searchresultset.each(function(searchresult)
                {
                    let vendorname = searchresult.getValue({name :'companyname'});
                    let subsidiaryname = searchresult.getText({name :'subsidiary'});
                    log.debug('Vendor Name', vendorname);
                    log.debug('Subsidiary', subsidiaryname);
                    return true;
                });
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
