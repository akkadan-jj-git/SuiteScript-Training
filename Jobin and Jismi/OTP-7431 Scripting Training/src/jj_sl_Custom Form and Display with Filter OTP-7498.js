/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if (scriptContext.request.method === 'GET') {
                    let form = serverWidget.createForm({
                        title: 'Sales Orders to be Fulfilled or Billed'
                    });
                    form.clientScriptFileId = 864;
    
                    let fieldGroup1 = form.addFieldGroup(
                    {
                        id: 'custpage_field_group',
                        label: 'Filters'
                    });
    
                    // Filters
                    // 1
                    let statusField = form.addField({
                        id: 'custpage_status',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Status',
                        container: 'custpage_field_group'
                    });
                    // statusField.addSelectOption({ value: '', text: '' });
                    statusField.addSelectOption({ value: '', text: 'Both' });
                    statusField.addSelectOption({ value: 'SalesOrd:B', text: 'Pending Fulfillment' });
                    statusField.addSelectOption({ value: 'SalesOrd:F', text: 'Pending Billing' });
    
                    // 2
                    let customerField = form.addField({
                        id: 'custpage_customer',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Customer',
                        source: 'customer',
                        container: 'custpage_field_group'
                    });
    
                    // 3
                    let subsidiaryField = form.addField({
                        id: 'custpage_subsidiary',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Subsidiary',
                        source: 'subsidiary',
                        container: 'custpage_field_group'
                    });
    
                    // 4
                    let departmentField = form.addField({
                        id: 'custpage_department',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Department',
                        source: 'department',
                        container: 'custpage_field_group'
                    });
    
                    // Sublist
                    let sublist = form.addSublist({
                        id: 'custpage_sublist',
                        type: serverWidget.SublistType.LIST,
                        label: 'Sales Orders'
                    });
    
                    sublist.addField({
                        id: 'custpage_internalid',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Internal ID'
                    });
                    sublist.addField({
                        id: 'custpage_docname',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Document Name'
                    });
                    sublist.addField({
                        id: 'custpage_date',
                        type: serverWidget.FieldType.DATE,
                        label: 'Date'
                    });
                    sublist.addField({
                        id: 'custpage_status',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Status'
                    });
                    sublist.addField({
                        id: 'custpage_customername',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Customer Name'
                    });
                    sublist.addField({
                        id: 'custpage_subsidiary',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Subsidiary'
                    });
                    sublist.addField({
                        id: 'custpage_department',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Department'
                    });
                    sublist.addField({
                        id: 'custpage_class',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Class'
                    });
                    sublist.addField({
                        id: 'custpage_linenumber',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Line Number'
                    });
                    sublist.addField({
                        id: 'custpage_subtotal',
                        type: serverWidget.FieldType.CURRENCY,
                        label: 'Subtotal'
                    });
                    sublist.addField({
                        id: 'custpage_tax',
                        type: serverWidget.FieldType.CURRENCY,
                        label: 'Tax'
                    });
                    sublist.addField({
                        id: 'custpage_total',
                        type: serverWidget.FieldType.CURRENCY,
                        label: 'Total'
                    });
    
                    let status = scriptContext.request.parameters.sostatus || '';
                    let customer = scriptContext.request.parameters.customer || '';
                    let subsidiary = scriptContext.request.parameters.subsidiary || '';
                    let department = scriptContext.request.parameters.department || '';
                    
                    let filter = [
                        ['mainline', 'is', 'T'], 'AND',
                        ['status', 'anyof','SalesOrd:B','SalesOrd:F']
                    ];
                    
                    customerField.defaultValue = customer;
                    statusField.defaultValue = status;
                    subsidiaryField.defaultValue = subsidiary;
                    departmentField.defaultValue = department;
                    
                    if(status){
                        filter[2] = ['status', 'is', status];
                    }
                    // log.debug('New Status', status);
                    if(customer){
                        filter.push('AND', ['entity', 'anyof', customer]);
                    }
                    if(subsidiary){
                        filter.push('AND', ['subsidiary', 'anyof', subsidiary]);
                    }
                    if(department){
                        filter.push('AND', ['department', 'anyof', department]);
                    }
    
                    let searchResults = search.create({
                        type: search.Type.SALES_ORDER,
                        filters: filter,
                        columns: [
                            'internalid', 'tranid', 'trandate', 'status', 'entity', 'subsidiary',
                            'department', 'class', 'netamountnotax', 'taxtotal', 'total'
                        ]
                    }).run().getRange({ start: 0, end: 100 });
                    for (let i = 0; i < searchResults.length; i++) {
                        sublist.setSublistValue({
                            id: 'custpage_internalid',
                            line: i,
                            value: searchResults[i].getValue('internalid')
                        });
                        sublist.setSublistValue({
                            id: 'custpage_docname',
                            line: i,
                            value: searchResults[i].getValue('tranid')
                        });
                        sublist.setSublistValue({
                            id: 'custpage_date',
                            line: i,
                            value: searchResults[i].getValue('trandate')
                        });
                        sublist.setSublistValue({
                            id: 'custpage_status',
                            line: i,
                            value: searchResults[i].getValue('status') || null
                        });
                        sublist.setSublistValue({
                            id: 'custpage_customername',
                            line: i,
                            value: searchResults[i].getText('entity')  || null
                        });
                        sublist.setSublistValue({
                            id: 'custpage_subsidiary',
                            line: i,
                            value: searchResults[i].getText('subsidiary')
                        });
                        sublist.setSublistValue({
                            id: 'custpage_department',
                            line: i,
                            value: searchResults[i].getText('department') || null
                        });
                        sublist.setSublistValue({
                            id: 'custpage_class',
                            line: i,
                            value: searchResults[i].getText('class') || null
                        });
                        // sublist.setSublistValue({
                        //     id: 'custpage_linenumber',
                        //     line: i,
                        //     value: searchResults[i].getValue('line')
                        // });
                        sublist.setSublistValue({
                            id: 'custpage_subtotal',
                            line: i,
                            value: searchResults[i].getValue('netamountnotax') || null
                        });
                        sublist.setSublistValue({
                            id: 'custpage_tax',
                            line: i,
                            value: searchResults[i].getValue('taxamount') || null
                        });
                        sublist.setSublistValue({
                            id: 'custpage_total',
                            line: i,
                            value: searchResults[i].getValue('total')
                        });                
                    }
                    scriptContext.response.writePage(form);
                } 
            }
            catch(e){
                log.error('Error: ', e.message);
            }
            // else{
            //     // Handle POST requests for dynamic filtering
            //     let status = scriptContext.request.parameters.custpage_status;
            //     let customer = scriptContext.request.parameters.custpage_customer;
            //     let subsidiary = scriptContext.request.parameters.custpage_subsidiary;
            //     let department = scriptContext.request.parameters.custpage_department;

            //     let filters = [['mainline', 'is', 'T'], 'AND',];
            //     if (status) filters.push(['status', 'anyof', status], 'AND',);
            //     if (customer) filters.push(['entity', 'anyof', customer], 'AND',);
            //     if (subsidiary) filters.push(['subsidiary', 'anyof', subsidiary], 'AND',);
            //     if (department) filters.push(['department', 'anyof', department], 'AND',);
            //     log.debug('Filters', filters);
            //     // scriptContext.response.writePage(form);
            // }
        }

        return {onRequest}

    });
