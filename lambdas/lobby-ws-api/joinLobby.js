const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = async function (event, context) {
  console.log("event: ", event);
  const req = JSON.parse(event.body);
  const code = req.code;
  console.log(req, code);

  var params = {
      TableName: process.env.lobbiesTable,
      FilterExpression: 'code = :c',
      ExpressionAttributeValues: {
          ':c': code
      }
  };
  
  let lobbies;
  try {
    lobbies = await ddb.scan(params).promise()
  } catch (err) {
    console.log("err: ", err);
    return {statusCode: 200}
  }
  if (lobbies){
    const lobby = lobbies.Items[0]
    console.log("key: ", lobby)

  try {
    await ddb
      .update({
        TableName: process.env.lobbiesTable,
        Key: { 'hostId' : lobby.hostId },
        UpdateExpression: 'set #g = :myId',
        ConditionExpression: '#g = :n',
        ExpressionAttributeValues: { ':myId' : event.requestContext.connectionId, ':n' : null},
        ExpressionAttributeNames: {'#g' : 'guestId'},
      })
      .promise();
  } catch (err) {
      console.log("error: ", err)
      return {
        statusCode: 500,
      };
    }
  
    try {
    await ddb
      .update({
        TableName: process.env.connectionsTable,
        Key: { 'connectionId' : event.requestContext.connectionId },
        UpdateExpression: 'set #l = :lobbyCode',
        ExpressionAttributeValues: { ':lobbyCode' : lobby.code},
        ExpressionAttributeNames: {'#l' : 'lobby'},
      })
      .promise();
    } catch (err) {
        console.log("error: ", err)
        return {
          statusCode: 500,
        };
    }
  }
  return {
    statusCode: 200,
  };
};
