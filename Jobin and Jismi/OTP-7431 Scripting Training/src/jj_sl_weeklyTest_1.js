/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/search'],
    /**
 * @param{record} record
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
                    title: 'User Information'
                });
                form.addField({
                    id: 'custpage_fname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });
                form.addField({
                    id: 'custpage_lname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });
                form.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                form.addField({
                    id: 'custpage_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                form.addField({
                    id: 'custpage_dob',
                    type: serverWidget.FieldType.DATE,
                    label: "Date of Birth"
                });
                // let accManager;
                // let email = scriptContext.request.parameters.custpage_email;
                // let salesRep = search.create({
                //     type: record.Type.CUSTOMER,
                //     filters: ['email', 'is', email],
                //     columns:['salesrep']
                // });
                // let searchResult = salesRep.run().getRange({
                //     start: 0,
                //     end: 1000
                // });
                // if(searchResult.length > 0){
                //     let currRecord = searchResult[0];
                //     accManager = currRecord.getText('salesrep');
                // }
                // else{
                //     accManager = '';
                // }
                // let repfield = form.addField({
                //     id: 'custpage_dob',
                //     type: serverWidget.FieldType.TEXT,
                //     label: "Account Manager"
                // });
                // repfield.defaultValue = 'Cathy';
                form.addSubmitButton({
                    lable: 'Submit'
                });
                scriptContext.response.writePage(form);
            }
            else{
                let fname = scriptContext.request.parameters.custpage_fname;
                let lname = scriptContext.request.parameters.custpage_lname;
                let email = scriptContext.request.parameters.custpage_email;
                let phone = scriptContext.request.parameters.custpage_phone;
                let dob = scriptContext.request.parameters.custpage_dob;
                // let srep = scriptContext.request.parameters.custpage_srep;

                let newRecord = record.create({
                    type: 'customrecord_jj_cr_wtest_1',
                    isDynamic: true
                });

                newRecord.setValue({
                    fieldId: 'custrecordfname',
                    value: fname
                }); 
                newRecord.setValue({
                    fieldId: 'custrecordlname',
                    value: lname
                }); 
                newRecord.setValue({
                    fieldId: 'custrecordphone',
                    value: phone
                }); 
                newRecord.setValue({
                    fieldId: 'custrecordemail',
                    value: email
                }); 
                newRecord.setValue({
                    fieldId: 'custrecorddob',
                    value: dob
                });
                let accManager;
                let salesRep = search.create({
                    type: record.Type.CUSTOMER,
                    filters: ['email', 'is', email],
                    columns:['salesrep']
                });
                let searchResult = salesRep.run().getRange({
                    start: 0,
                    end: 1000
                });
                if(searchResult.length > 0){
                    let currRecord = searchResult[0];
                    accManager = currRecord.getText('salesrep');
                }
                else{
                    accManager = '';
                }
                newRecord.setValue({
                    fieldId: 'custrecordsrep',
                    value: accManager
                }); 

                newRecord.save();

                scriptContext.response.write('Registration success');
            }
        }

        return {onRequest}

    });
