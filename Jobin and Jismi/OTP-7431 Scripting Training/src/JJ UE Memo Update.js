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
            if (scriptContext.type !== scriptContext.UserEventType.EDIT) {
                return;
            }
            let newRecord = scriptContext.newRecord;
            let recordType = newRecord.type;
            if (recordType === record.Type.SALES_ORDER) {
                let CheckBox = newRecord.getValue('custbody_jj_memoupdate');
                log.debug('CheckBox Value', CheckBox);
                if (CheckBox) {
                    newRecord.setValue({
                        fieldId: 'memo',
                        value: 'memo updated'
                    });
                }
                else{
                    newRecord.setValue({
                        fieldId: 'memo',
                        value: ''
                    });
                }
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContet.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
