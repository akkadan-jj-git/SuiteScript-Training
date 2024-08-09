/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/email', 'N/runtime'],
    /**
 * @param{record} record
 */
    (record, email, runtime) => {
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
            let newRecord = scriptContext.newRecord;
            let recordType = newRecord.type;
            let recordId = newRecord.getValue('id');
            let Name = newRecord.getValue('entityid');
            // let createdBy = newRecord.getText('createdby');
            let currentUser = runtime.getCurrentUser();
            let createdBy = currentUser.id;
            // log.debug('Created By', createdBy);
            let senderId = 30;
            let recipientId = createdBy;
            if(scriptContext.type === scriptContext.UserEventType.CREATE){
                let subject = "New entity created.";
                let body = "Record Type: " + recordType + "\n Internal Id: " + recordId + "\n Name: " + Name;
                email.send({
                    author: senderId,
                    recipients: recipientId,
                    subject: subject,
                    body: body
                });
            }
            else if(scriptContext.type === scriptContext.UserEventType.DELETE){
                let subject = "One entity deleted.";
                let body = "Record Type: " + recordType + "\n Internal Id: " + recordId + "\n Name: " + Name;
                email.send({
                    author: senderId,
                    recipients: recipientId,
                    subject: subject,
                    body: body
                });
            }
        }
        return {beforeLoad, beforeSubmit, afterSubmit}
    });