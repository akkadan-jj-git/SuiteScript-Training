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
            var poRecord = record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: true
            });

            var vendorId = 28;
            poRecord.setValue({
                fieldId: 'entity',
                value: vendorId
            });

            poRecord.setValue({
                fieldId: 'memo',
                value: 'Created via SuiteScript'
            });

            poRecord.selectNewLine({ sublistId: 'item' });
            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: 35
            });

            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: 10
            });

            poRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                value: 20
            });

            poRecord.commitLine({ sublistId: 'item' });

            var poId = poRecord.save();

            log.debug('Purchase Order ID', poId);
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
