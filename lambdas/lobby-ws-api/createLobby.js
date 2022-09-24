const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = async function (event, context) {
  console.log("event: ", event)
  
  let lobbies;
  try {
      lobbies = await ddb.scan({ TableName: process.env.lobbiesTable}).promise();
  } catch (err) {
      return {
          err: err,
          statusCode: 500,
      };
  }
  const code = generateLobbyCode(lobbies)
  console.log("code: ", code)
  
  try {
    await ddb
      .put({
        TableName: process.env.lobbiesTable,
        Item: {
          hostId: event.requestContext.connectionId,
          code: code,
          guestId: null
        },
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
        ExpressionAttributeValues: { ':lobbyCode' : code},
        ExpressionAttributeNames: {'#l' : 'lobby'},
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

function generateLobbyCode(lobbies){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let codelen = 4
    let code = ""
    let codeTaken = false
    for(let i = 0; i < codelen; i++){
        code = code + alphabet.charAt(Math.trunc(Math.random()*alphabet.length))
    }
    
    lobbies.Items.forEach( ({lobbyCode}) => {
        if (code == lobbyCode) codeTaken = true;
    });

    if(!codeTaken){
        return code;
    }
    else if(codeTaken){
        return generateLobbyCode(lobbies)
    }
}