const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event, context) {

  let me;
  try {
    me = await ddb.get( {TableName : process.env.connectionsTable, Key: { 'connectionId' : event.requestContext.connectionId }}).promise();
  } catch (err) {
      console.log("err: ", err);
      return {
          statusCode: 200
      };
  }
  
  console.log("me: ", me)
  const myLobby = me.Item.lobby
    
  let params = {
      TableName: process.env.connectionsTable,
      FilterExpression: 'lobby = :c',
      ExpressionAttributeValues: {
          ':c' : myLobby
      }
  }
  let connections;
  try {
    connections = await ddb.scan(params).promise();
  } catch (err) {
    console.log("err: ", err)
    return {
      statusCode: 500,
    };
  }
  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });

  const message = JSON.parse(event.body).message;

  const sendMessages = connections.Items.map(async ({ connectionId }) => {
    if (connectionId !== event.requestContext.connectionId) {
      try {
        await callbackAPI
          .postToConnection({ ConnectionId: connectionId, Data: message })
          .promise();
      } catch (e) {
        console.log(e);
      }
    }
  });

  try {
    await Promise.all(sendMessages);
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
    };
  }

  return { statusCode: 200 };
};
