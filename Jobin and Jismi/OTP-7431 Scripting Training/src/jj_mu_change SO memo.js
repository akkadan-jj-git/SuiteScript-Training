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
                    id: params.id,
                    isDynamic: true
                });
                // rec.setValue('memo', "Memo updated");
                rec.setValue({
                    fieldId: 'memo',
                    value: 'Memo updated',
                    ignoreFieldChange: true
                });
                rec.save();
                log.debug('Sales Order Updated, Sales Order ID: ', params.id);
                let memo = rec.getValue('memo');
                log.debug('Memo', memo);
            }
            catch(e){
                log.error('Error:', e.message);
            }
        }

        return {each}

    });
