/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/search'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget, search) => {
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
                    title: 'Registration Form'
                });
                form.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                form.addField({
                    id: 'custpage_age',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Age'
                });
                form.addField({
                    id: 'custpage_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                form.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                form.addField({
                    id: 'custpage_father',
                    type: serverWidget.FieldType.TEXT,
                    label: "Father's Name"
                });
                form.addField({
                    id: 'custpage_address',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Address'
                });
                form.addSubmitButton({
                    lable: 'Submit'
                });
                scriptContext.response.writePage(form);

            }
            else{
                let name = scriptContext.request.parameters.custpage_name;
                let age = scriptContext.request.parameters.custpage_age;
                let phone = scriptContext.request.parameters.custpage_phone;
                let email = scriptContext.request.parameters.custpage_email;
                let father = scriptContext.request.parameters.custpage_father;
                let address = scriptContext.request.parameters.custpage_address;

                let newRecord = record.create({
                    type: 'customrecord_jj_dtest_record',
                    isDynamic: true
                });

                newRecord.setValue({
                    fieldId: 'name',
                    value: name
                }); 
                newRecord.setValue({
                    fieldId: 'custrecorddtest_age',
                    value: age
                }); 
                newRecord.setValue({
                    fieldId: 'custrecorddtest_phone',
                    value: phone
                }); 
                newRecord.setValue({
                    fieldId: 'custrecorddtest_email',
                    value: email
                }); 
                newRecord.setValue({
                    fieldId: 'custrecorddtest_father',
                    value: father
                }); 
                newRecord.setValue({
                    fieldId: 'custrecorddtest_address',
                    value: address
                }); 

                newRecord.save();

                scriptContext.response.write('Registration success');
            }
        }

        return {onRequest}

    });
