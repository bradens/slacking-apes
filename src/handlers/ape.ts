import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import moment from "moment";
import fetch from "node-fetch";

import { res } from "../Response";
import { Currency, PriceResponse } from "../types";

const ethStart = 2160.1665139279366;
const bnbStart = 593.6496850177712;
const end = 1649746800;

const getTimeRemaining = () => {
  const total = new Date(end * 1000).getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

const fetchData = async <T extends Currency>(
  currency: T
): Promise<PriceResponse<T>> => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd&include_last_updated_at=true`
  );
  const json = (await res.json()) as PriceResponse<T>;
  return json;
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const [ethData, binanceData] = await Promise.all([
    fetchData(Currency.ETH),
    fetchData(Currency.BNB),
  ]);

  const ethEnd = ethData.ethereum.usd;
  const ethDelta = -100 * ((ethStart - ethEnd) / ((ethStart + ethEnd) / 2));
  const bnbEnd = binanceData.binancecoin.usd;
  const bnbDelta = -100 * ((bnbStart - bnbEnd) / ((bnbStart + bnbEnd) / 2));
  let winner, loser;
  const atbrett = "<@U01MEB6EC8P|brett>";
  const atmike = "<@U03PC0K23|mike>";
  if (ethDelta > bnbDelta) {
    winner = "mike";
    loser = atbrett;
  } else {
    winner = "brett";
    loser = atmike;
  }

  return res({
    response_type: "in_channel",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Winning: :clap: *${winner}*. Losing: :sob: *${loser}* \n *${
            bnbDelta > 0 ? "+" : ""
          }${bnbDelta.toFixed(2)}% BNB* vs. *${
            ethDelta > 0 ? "+" : ""
          }${ethDelta.toFixed(2)}% ETH*`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `:clock1: ${getTimeRemaining()}`,
          },
          {
            type: "mrkdwn",
            text: `Updated: ${moment(
              ethData.ethereum.last_updated_at * 1000
            ).format("hh:mm:ss utc")}`,
          },
        ],
      },
    ],
  });
};
