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
            var customerId = 25;
            var itemId = 35;
            var quantity = 2;
            var rate = 200.00;

            var salesOrder = record.create({
                type: record.Type.SALES_ORDER,
                isDynamic: true
            });

            salesOrder.setValue({
                fieldId: 'entity',
                value: customerId
            });

            salesOrder.selectNewLine({
                sublistId: 'item'
            });

            salesOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: itemId
            });

            salesOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: quantity
            });

            salesOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                value: rate
            });

            salesOrder.commitLine({
                sublistId: 'item'
            });

            var salesOrderId = salesOrder.save();

            log.debug({
                title: 'Sales Order Created',
                details: 'Sales Order ID: ' + salesOrderId
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
