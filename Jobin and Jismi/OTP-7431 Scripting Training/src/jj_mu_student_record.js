/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            try{
                let studentRecord = record.load({
                    type: params.type,
                    id: params.id,
                    isDynamic: true
                });
                log.debug('StudentId', params.id);
                let cls = studentRecord.getValue('custrecord_jj_class');
                log.debug('Class', cls);
                if(cls === "10" || cls === "Completed"){
                    studentRecord.setValue({
                        fieldId: 'custrecord_jj_class',
                        value: "Completed"
                    });
                    studentRecord.save();
                }
                else{
                    cls = Number(cls) + 1;
                    studentRecord.setValue({
                        fieldId: 'custrecord_jj_class',
                        value: cls
                    });
                    log.debug('New Class', cls);
                    studentRecord.save();
                }
                log.debug('Class updated for student:', params.id);
            }
            catch(e){
                log.error('Error:', e.message);
            }
        }

        return {each}

    });
