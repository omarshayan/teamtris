const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = async function (event, context) {
  console.log("event: ", event)
  try {
    await ddb
      .put({
        TableName: process.env.table,
        Item: {
          connectionId: event.requestContext.connectionId,
          lobby: null
        },
      })
      .promise();
  } catch (err) {
    console.log("error: ", err)
    return {
      statusCode: 500,
    };
  }
  return {
    statusCode: 200,
  };
};