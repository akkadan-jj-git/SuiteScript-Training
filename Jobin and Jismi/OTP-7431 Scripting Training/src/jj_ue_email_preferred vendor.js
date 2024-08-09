/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, runtime, search) => {
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
            if (scriptContext.type !== scriptContext.UserEventType.CREATE) {
                return;
            }
    
            let purchaseOrder = scriptContext.newRecord;
            let employeeId = purchaseOrder.getValue('employee');
            let itemCount = purchaseOrder.getLineCount({ sublistId: 'item' });
    
            for (let i = 0; i < itemCount; i++) {
                let itemId = purchaseOrder.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });
    
                let itemRecord = record.load({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId
                });
    
                let preferredVendor = itemRecord.getValue('preferredvendor');
    
                if (!preferredVendor) {
                    const itemName = record.load({
                        type: record.Type.INVENTORY_ITEM,
                        id: itemId
                    }).getValue('itemid');

                    email.send({
                        author: runtime.getCurrentUser().id,
                        recipients: employeeId,
                        subject: 'Preferred Vendor Missing for Item',
                        body: 'No preferred vendor is added for the item: ' + itemName + '.'
                    });
                }
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
