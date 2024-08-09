/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/format'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if(scriptContext.request.method === 'GET'){
                let form = serverWidget.createForm({
                    title: 'Eligible Blood Donors',
                });
                let fieldGroup1 = form.addFieldGroup({
                    id: 'custpage_field_group',
                    label: 'Primary Information'
                });
                form.addField({
                    id: 'bloodgroup',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group',
                    source: 'customlist_jj_blood_group',
                    container: 'custpage_field_group'
                });
                form.addSubmitButton({
                    label: 'Submit'
                });
                scriptContext.response.writePage(form);
            }
            else{
                let bg = scriptContext.request.parameters.bloodgroup;
                let donorSearch = search.load({
                    id: 'customsearch_jj_elligible_blood_donors',
                });
                let searchResult = donorSearch.run();
                let eligibleDonors = [];
                eligibleDonors = '<html><body><table border="1" cellpadding="5" cellspacing="0"';
                eligibleDonors += '<tr><th>Donor Name</th><th>Phone Number</th></tr>';
                searchResult.each(function(result){
                    let name = result.getValue('custrecord_jj_bd_fname');
                    let phone = result.getValue('custrecord_jj_bd_phone');
                    let bgp = result.getValue('custrecord_jj_bd_blood_group');
                    log.debug('Blood Group', bgp);
                    if(bgp === bg){
                        eligibleDonors += '<tr><td>' + name + '</td><td>' + phone + '</td></tr>';
                    }
                    return true;
                });
                eligibleDonors += '</table></body></html>';
                scriptContext.response.write(eligibleDonors);
            }
        }

        return {onRequest}

    });
