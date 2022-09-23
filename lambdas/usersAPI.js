const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let requestJSON;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /users/{userId}":
        await dynamo
          .delete({
            TableName: process.env.table,
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /users/{userId}":
        body = await dynamo
          .get({
            TableName: process.env.table,
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "GET /users":
        body = await dynamo.scan({ TableName: process.env.table }).promise();
        break;
      case "PUT /users":
        requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: process.env.table,
            Item: {
              id: requestJSON.id,
              price: requestJSON.price,
              name: requestJSON.name
            }
          })
          .promise();
        body = `Put user ${requestJSON.id}`;
        break;
      case "POST /users":
        requestJSON = JSON.parse(event.body);
        await dynamo
            .update({
            TableName: process.env.table,
            Item: {
                id: requestJSON.id,
                price: requestJSON.price,
                name: requestJSON.name
            }
            })
            .promise();
        body = `Put user ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
