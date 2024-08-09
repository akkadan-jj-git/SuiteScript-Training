/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            let soid = requestParams.id;

            try{
                let so = record.load({
                    type: record.Type.SALES_ORDER,
                    id: soid
                });
    
                let entity = so.getValue({ fieldId: 'entity' });
                // let date = so.getValue({ fieldId: 'trandate' });
                let dateObj = new Date(so.trandate);
                let total = so.getValue({ fieldId: 'total' });
                let itemCount = so.getLineCount({ sublistId: 'item' });
                let items = [];
                log.debug('Item Count', itemCount);

                for (let i = 0; i < itemCount; i++) {
                    let itemName = so.getSublistText({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    let quantity = so.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });
                    let rate = so.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: i
                    });
                    let amount = so.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        line: i
                    });

                    items.push({
                        itemName: itemName,
                        quantity: quantity,
                        rate: rate,
                        amount: amount
                    });
                }

                let response = {
                    salesOrderId: soid,
                    entityId: entity,
                    tranDate: dateObj,
                    total: total,
                    items: items
                };

                if (itemCount > 2) {
                    response.message = "Sales order contains more than 2 items";
                }

                return response;
            }

            // return {
            //     get: getSalesOrderDetails
            // };
            //     return salesOrderDetails;
            // } 
            catch (error) {
                return {
                    status: 'error',
                    message: error.message
                };
            }
        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });
