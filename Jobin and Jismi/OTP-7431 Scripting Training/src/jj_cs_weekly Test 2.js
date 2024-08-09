/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/currentRecord', 'N/search'],

function(record, currentRecord, search) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    /**function pageInit(scriptContext) {

    }

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
        let currentRec = scriptContext.currentRecord;
        let fieldName = scriptContext.fieldId;
        let sublistName = scriptContext.sublistId;

        if(sublistName === 'item' && fieldName === 'item'){
            let line = scriptContext.line;
            let itemId = currentRec.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: line
            });
            let qty = currentRec.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: line
            });
            if(itemId){
                let availableQty = 0;
                let itemSearch = search.create({
                    type: search.Type.ITEM,
                    filters: [
                        ['internalid', 'is', itemId]
                    ],
                    columns: [
                        'quantityavailable'
                    ]
                });
                itemSearch.run().each(function(result) {
                    availableQty = result.getValue('quantityavailable');
                    log.debug('Availability', availableQty);
                    log.debug('item id', itemId);
                    log.debug('quantity', qty);
                    return false;   
                });
                if(availableQty < qty){
                    currentRec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_jj_availability_line',
                        line: line,
                        value: availableQty
                    });
                    currentRec.setValue({
                        fieldId: 'custbody_jj_itemavailstatus_body',
                        value: "Available"
                    });
                }
                else{
                    currentRec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_jj_availability_line',
                        line: line,
                        value: 0
                    });
                    currentRec.setValue({
                        fieldId: 'custbody_jj_itemavailstatus_body',
                        value: "Backordered"
                    });
                }
            }
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
    /**function postSourcing(scriptContext) {

    }

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
    /**function lineInit(scriptContext) {

    }

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
    /**function validateLine(scriptContext) {

    }

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
    /**function validateInsert(scriptContext) {

    }

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
    /**function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        let currentRec = scriptContext.currentRecord;
        let val = currentRec.getValue('custbody_jj_itemavailstatus_body')
        if(val !== 'Available'){
            return false;
        }
        else{
            return true;
        }
    }

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
        saveRecord: saveRecord
    };
    
});
