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
                let rec = record.load({
                    type: params.type,
                    id: params.id
                });
                // log.debug('Record Type', params.type);
                let mstatus = rec.getValue('custrecordmaritalstatus');
                // log.debug('Marital Status', mstatus);
                if(mstatus == 1){
                    rec.setValue({
                        fieldId: 'custrecordmaritalstatus',
                        value: 2
                    });
                    rec.save();
                }
            }
            catch(e){
                log.error('Error: ', e.message);
            }
        }

        return {each}

    });
