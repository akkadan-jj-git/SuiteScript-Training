/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/url'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{url} url
     */
    function (record, search, url) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        // function pageInit(scriptContext) {

        // }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            let fieldId = scriptContext.fieldId;
            console.log("CS Started");
            let currentRecord = scriptContext.currentRecord;

            let sta = currentRecord.getValue({ fieldId: 'custpage_status' }) || '';//mod
            if (fieldId === 'custpage_status') {
                sta = currentRecord.getValue({ fieldId: 'custpage_status' });
            }
            console.log('Status: ', sta);
            let cus = currentRecord.getValue({ fieldId: 'custpage_customer' }) || '';//mod
            if (fieldId === 'custpage_customer') {
                cus = currentRecord.getValue({ fieldId: 'custpage_customer' });
            }

            let sub = currentRecord.getValue({ fieldId: 'custpage_subsidiary' }) || '';//mod
            if (fieldId === 'custpage_subsidiary') {
                sub = currentRecord.getValue({ fieldId: 'custpage_subsidiary' });
            }

            let dep = currentRecord.getValue({ fieldId: 'custpage_department' }) || '';//mod
            if (fieldId === 'custpage_department') {
                dep = currentRecord.getValue({ fieldId: 'custpage_department' });
            }
            console.log('Status', sta);
            console.log('Customer', cus);
            console.log('Subsidiary', sub);
            console.log('Department', dep);
            // let filter = scriptContext.Value;
            if (scriptContext.fieldId === 'custpage_status' || scriptContext.fieldId === 'custpage_customer' || scriptContext.fieldId === 'custpage_subsidiary' || scriptContext.fieldId === 'custpage_department') {
                console.log("Checked...");
                document.location = url.resolveScript({
                    scriptId: 'customscript_jj_sl_displayfilter_otp7498',
                    deploymentId: 'customdeploy_jj_sl_displayfilter_otp7498',
                    params: {

                        sostatus: sta || '',
                        customer: cus || '',
                        subsidiary: sub || '',
                        department: dep || ''
                    }
                });
            }
        }
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        // function postSourcing(scriptContext) {

        // }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        // function sublistChanged(scriptContext) {

        // }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        // function lineInit(scriptContext) {

        // }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        // function validateField(scriptContext) {

        // }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        // function validateLine(scriptContext) {

        // }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        // function validateInsert(scriptContext) {

        // }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        // function validateDelete(scriptContext) {

        // }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        // function saveRecord(scriptContext) {

        // }

        return {
            // pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });
