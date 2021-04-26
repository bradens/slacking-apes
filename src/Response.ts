import { APIGatewayProxyResult } from "aws-lambda";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json",
};

export const res = (body = {}, status = 200): APIGatewayProxyResult => {
  return {
    headers,
    statusCode: status,
    body: JSON.stringify(body),
  };
};
