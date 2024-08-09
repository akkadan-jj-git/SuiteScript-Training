/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
/*****************************************************************************************************************************************
 * OTP
 *
 * OTP-7492:Monthly Sales Notification for Sales Rep
 *
 *******************************************************************************************************************************************
 *
 * Author: Jobin & Jismi IT Services
 *
 * Date Created : 30-July-2024
 *
 *  Description :Send an email notification to all sales representatives once a month. We need to send the customer sales information from the 
    previous month to the corresponding sales representative.
    This email notification should include the Customer Name and Email, Sales Order Document Number, and Sales Amount, which is attached as a CSV File. 
    If there is no sales representative for the customer, the customer's sales information must send to a static NetSuite admin, along with a message to 
    add a sales representative for the corresponding customers.
 *
 * REVISION HISTORY
 *
 * @version 1.0 OTP-7492 : 30-July-2024 : Created the initial build by JJ0340
 *********************************************************************************************************************************************/
define(['N/email', 'N/file', 'N/record', 'N/search', 'N/runtime', 'N/log'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (email, file, record, search, runtime, log) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            try{
                return search.create({
                    type: search.Type.SALES_ORDER,
                    filters:[
                        ['trandate', 'within', 'thismonth'], 
                        'AND', 
                        ['mainline', 'is', 'T']
                    ],
                    columns:['entity', 'tranid', 'total', 'salesrep']
                })
            }
            catch(e){
                log.error('Error in getting value:', e.message);
            };
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try{
                let result = JSON.parse(mapContext.value);
                let customerName = result.values.entity.text;
                let customerId = result.values.entity.value;
                let documentNumber= result.values.tranid;
                let amount = result.values.total;
                let salesRepId = result.values.salesrep.value;
                let salesRepName = result.values.salesrep.text;
                mapContext.write({
                    key: salesRepId || 'noSalesRep',
                    value:{
                        cName: customerName,
                        cId: customerId,
                        cEmail: email,
                        docNumber: documentNumber,
                        sRepId: salesRepId,
                        sRepName: salesRepName,
                        total: amount
                    }
                });
            }
            catch(e){
                log.error('Error found in Map ', e.message);
            }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            try{
                let csvData = 'Customer Name, Customer Email, Sales Order Document Number, Sales Amount\n';
                let repId = reduceContext.key;

                let currentDate = new Date();
                let monthIndex = currentDate.getMonth();

                let monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                
                let currentMonthName = monthNames[monthIndex];
                // log.debug('Current Month Name', currentMonthName);
                let details = reduceContext.values.map(function(value){
                    return JSON.parse(value);
                }); 
                log.debug('Details', details);
                details.forEach(function(data){
                    let cid = data.cId;
                    let crec = record.load({
                        type: record.Type.CUSTOMER,
                        id: cid
                    });
                    let cmail = crec.getValue('email');
                    log.debug('Email', cmail);
                    csvData += data.cName + ',' + cmail + ',' + data.docNumber + ',' + data.total + '\n'; 
                });
                // log.debug('CSV Data', csvData);
                let csvFile = file.create({
                    name: 'Monthly Sales Orders - '+ repId +'.csv',
                    fileType: file.Type.CSV,
                    contents: csvData,
                    folder: -15
                });
                let fileId = csvFile.save();
                // let fileObj = file.load({ id: fileId });

                if(repId === 'noSalesRep'){
                    email.send({
                        author : -5,
                        recipients: 'adminfun051424sy@netsuite.com',
                        subject:'Monthly Sales Orders (' + currentMonthName + ')',
                        body: 'Sales Orders with no Sales Reps associated to them. Please add Sales Reps to these records.',
                        attachments: [file.load({
                            id: fileId
                        })]
                    });
                }
                else{
                    email.send({
                        author: -5,
                        recipients: repId,
                        subject:'Monthly Sales Orders (' + currentMonthName + ')',
                        body: 'Sales Orders of ' + currentMonthName,
                        attachments: [file.load({
                            id: fileId
                        })]
                    });
                }
            }
            catch(e){
                log.error('Error found in Reduce ', e.message);
            }
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        return {getInputData, map, reduce, summarize}

    });
