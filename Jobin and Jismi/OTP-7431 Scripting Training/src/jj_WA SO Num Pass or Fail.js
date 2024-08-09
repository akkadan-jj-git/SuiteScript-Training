/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/currentRecord'],
    /**
 * @param{record} record
 */
    (record, currentRecord) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            let nRec = scriptContext.newRecord;
            let nRecId = scriptContext.id;
            let numberField = nRec.getValue({fieldId:'custbody_jj_was_test_bfield_num'});
            let x;
            if( numberField >= 100){
                // nRec.submitFields({
                //     type: record.Type.SALES_ORDER,
                //     id: nRecId,
                //     values:
                //     {
                //         custbody_jj_was_test_bfield_res: "Result : Passed"
                //     }
                // });
                x = "Passed";
            }
            else{
                // nRec.setValue({
                //     fieldId: 'custbody_jj_was_test_bfield_res',
                //     value: "Result : Failed"
                // });
                // nRec.save();
                x = "Failed";
            }
            return x;
        }
        return {onAction};
    });
