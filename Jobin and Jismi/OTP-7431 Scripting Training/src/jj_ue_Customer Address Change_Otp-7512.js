/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
/*****************************************************************************************************************************************
 * OTP
 *
 * OTP-7512: Identify change in Address
 *
 *******************************************************************************************************************************************
 *
 * Author: Jobin & Jismi IT Services LLP
 *
 * Date Created : 5-August-2024
 *
 *  Description : There is a checkbox in Customer Record. Whenever there is a change in exiting Address or new Address is added 
 *                  to the Customer Record, the custom field should be checked. This should work in Edit context.
 *
 * REVISION HISTORY
 *
 * @version 1.0 OTP-7512 : 5-August-2024 : Created the initial build by JJ0340
 *********************************************************************************************************************************************/
define(['N/currentRecord', 'N/log', 'N/record', 'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, log, record, search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        // const beforeLoad = (scriptContext) => {

        //  }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            try {
                if (scriptContext.type === scriptContext.UserEventType.EDIT) {
                    let newrecordObj = scriptContext.newRecord;
                    let oldrecordObj = scriptContext.oldRecord;
                    //Displaying the intial value of address_changed checkbox
                    let address_changed = newrecordObj.getValue({
                        fieldId: 'custentity_jj_cb_address_changed'
                    });
                    log.debug("Old Value", address_changed);
                    //Retrieving the old record line count
                    let count1 = oldrecordObj.getLineCount({
                        sublistId: "addressbook"
                    });
                    log.debug("Count", count1);
                    //Retrieving the new record line count
                    let count2 = newrecordObj.getLineCount({
                        sublistId: "addressbook"
                    });
                    log.debug("Count", count2);
                    //Retrieving the old record address
                    let oldaddress;
                    for (i = 0; i < count1; i++) {
                        oldaddress = oldrecordObj.getSublistValue({
                            sublistId: "addressbook",
                            fieldId: "addressbookaddress_text",
                            line: i
                        });
                    }
                    log.debug("Old address:", oldaddress);
                    //Retrieving the new record address
                    let newaddress;
                    for (i = 0; i < count2; i++) {
                        newaddress = newrecordObj.getSublistValue({
                            sublistId: "addressbook",
                            fieldId: "addressbookaddress_text",
                            line: i
                        });
                    }
                    log.debug("New address:", newaddress);
                    //when a new address line is added
                    // if(count2 > count1){

                    // }
                    if (newaddress !== oldaddress) {
                        newrecordObj.setValue({
                            fieldId: "custentity_jj_cb_address_changed",
                            value: true,
                            ignoreFieldChange: true
                        });
                        address_changed = newrecordObj.getValue({
                            fieldId: 'custentity_jj_cb_address_changed',
                            ignoreFieldChange: true
                        });
                        log.debug("New Value", address_changed);

                    }
                    else {
                        newrecordObj.setValue({
                            fieldId: "custentity_jj_cb_address_changed",
                            value: false,
                            ignoreFieldChange: true
                        });

                        address_changed = newrecordObj.getValue({
                            fieldId: 'custentity_jj_cb_address_changed'
                        });
                        log.debug("New Value", address_changed);

                    }
                }
            }
            catch (e) {
                log.error("Error on afterSubmit", e.message);
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        //  const afterSubmit = (scriptContext) => {
        // }

        return { beforeSubmit }

    });