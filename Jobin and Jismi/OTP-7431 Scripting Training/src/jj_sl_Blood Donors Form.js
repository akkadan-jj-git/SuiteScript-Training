/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/format'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 * @param{format} format
 */
    (record, serverWidget, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) =>
        {
            if (scriptContext.request.method === 'GET')
            {
                let form = serverWidget.createForm({title: 'Blood Donor Details'});
                let fieldGroup1 = form.addFieldGroup({
                    id: 'custpage_field_group',
                    label: 'Primary Information'
                });
                form.addField({
                    id: 'custpage_fname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name',
                    container: 'custpage_field_group'
                });
                form.addField({
                    id: 'custpage_lname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name',
                    container: 'custpage_field_group'
                });
                let gender = form.addField({
                    id: 'custpage_gender',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Gender',
                    source: 'customlist_jj_clist_gender',
                    container: 'custpage_field_group'
                });
                form.addField({
                    id: 'custpage_phonenumber',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number',
                    container: 'custpage_field_group'
                });
                let bloodGrp = form.addField({
                    id: 'custpage_bloodgroup',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group',
                    source: 'customlist_jj_blood_group',
                    container: 'custpage_field_group'
                });
                form.addField({
                    id: 'custpage_lastdonationdate',
                    type: serverWidget.FieldType.DATE,
                    label: 'Last Donation Date',
                    container: 'custpage_field_group'
                });
                form.addSubmitButton({label: 'Submit'});
                scriptContext.response.writePage(form);
            }
            else{
                let fname = scriptContext.request.parameters.custpage_fname;
                let lname = scriptContext.request.parameters.custpage_lname;
                let gender = scriptContext.request.parameters.custpage_gender;
                let phoneNumber = scriptContext.request.parameters.custpage_phonenumber;
                let bloodGroup = scriptContext.request.parameters.custpage_bloodgroup;
                let lastDonationDate = scriptContext.request.parameters.custpage_lastdonationdate;
                let formDetails = "First Name: " + fname +'<br>'+ "Last Name: " + lname +'<br>'+ "Blood group: "+ bloodGroup +'<br>'+ "Phoner Number: " + phoneNumber +'<br>'+ "Gender: " + gender +'<br>'+ "Last Donation date: " + lastDonationDate +'<br>';
 
                let formattedLastDonationDate = format.parse(
                {
                    value: lastDonationDate,
                    type: format.Type.DATE
                });
                let customRec = record.create(
                {
                    type: 'customrecord_jj_blood_donation',
                    isDynamic: true
   
                });
                customRec.setValue('custrecord_jj_bd_fname', fname);
                customRec.setValue('custrecord_jj_bd_lname', lname);
                customRec.setValue('custrecord_jj_bd_gender', gender);
                customRec.setValue('custrecord_jj_bd_phone', phoneNumber);
                customRec.setValue('custrecord_jj_bd_blood_group', bloodGroup);
                customRec.setValue('custrecord_jj_last_bd_date', formattedLastDonationDate);
                customRec.save();
                scriptContext.response.write(formDetails);
            }
        }
    return {onRequest}
});