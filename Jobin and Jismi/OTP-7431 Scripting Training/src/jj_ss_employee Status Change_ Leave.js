/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let empdet = search.create({
                type: 'customrecord_jj_crt_emp_details',
                columns:['internalid', 'isinactive', 'custrecordemp_name', 'custrecordemp_dept', 'custrecordemp_leaves']
            });
            let result = empdet.run();
            let desigVacationDays = 15;
            let probationPeriod = 90;
            // log.debug('Search Result', result);
            result.each(function(searchResult){
                let empid = searchResult.id;
                log.debug('Employee Id', empid);
                let emprecord = record.load({
                    type: 'customrecord_jj_crt_emp_details',
                    id: empid
                });
                let emp_inactive = emprecord.getValue('isinactive');
                log.debug('Inactive?', emp_inactive);   
                // let emp_id = emprecord.getValue('internalid');
                // let emp_name = emprecord.getValue('custrecordemp_name');
                // let emp_dept = emprecord.getValue('custrecordemp_dept');
                let emp_leave = emprecord.getValue('custrecordemp_leaves');
                if(emp_inactive === false){
                    if(emp_leave > 15){
                        emprecord.setValue({
                            fieldId: 'custrecordemp_status',
                            value: 'On Leave',
                            ignoreFieldChange: true
                        });
                        emprecord.save();
                    }
                }
                else{
                    if(emp_leave > probationPeriod){
                        emprecord.setValue({
                            fieldId: 'custrecordemp_status',
                            value: 'Terminated',
                            ignoreFieldChange: true
                        });
                        emprecord.save();
                    }
                }
                return true;
            });
        }

        return {execute}

    });
