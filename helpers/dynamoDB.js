// DynamoDB acts as a cache to store, for example, the users'
// cer Groups, to save calls to the grouper API
// we use the users' upi as the storage partition key

const DynamoDB = require('aws-sdk/clients/dynamodb');

const dynamoDbClient = new DynamoDB.DocumentClient();

export async function getFromDynamoDB(upi) {
  const tableName = process.env.DYNAMODB_TABLE_NAME;
  console.log(`Get user info from DynamoDB (table=${tableName})`);
  const params = {
    TableName: tableName,
    Key: {
      upi: upi,
    },
  };
  return dynamoDbClient.get(params);
};

export async function saveToDynamoDB(upi, data) {
  const ttlHours = process.env.CACHE_NUMBER_OF_HOURS;
  const tableName = process.env.DYNAMODB_TABLE_NAME;
  console.log(
    `Storing user info into DynamoDB (table=${tableName}) for ${ttlHours} hours`
  );

  // Set a time to live to let dynamo remove old entries
  let now = new Date();
  let expTime = new Date(now.setHours(
    now.getHours() + parseInt(ttlHours, 10))
  );

  const item = {
    upi: upi,
    updated_at: new Date(),
    ttl: expTime.getTime(),
    data: data,
  };
  const params = {
    TableName: tableName,
    Item: item,
  };
  return dynamoDbClient.put(params);
};
