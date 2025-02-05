import { NextApiRequest, NextApiResponse } from "next";
const riotUrl =
  "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id";
const apiKey = process.env.RIOT_API_KEY;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { summonerName, summonerTag },
  } = req;
  if (req.method === "GET") {
   
    const result = await fetch(
      `${riotUrl}/${summonerName}/${summonerTag}?api_key=${apiKey}`,
      {
        method: "GET",
        redirect: "follow",
        
        headers: {
          "Content-Type": "application/json",
          Authorization: `X-Riot-Token ${apiKey}`,
          Origin: "https://developer.riotgames.com",
          accept: "application/json",
          "accept-format": "application/json",
          "accept-charset": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    ).then((response) => response.json());
    console.log('result', result);
    res.send(result);
  } else {
    res.status(405).send({ message: "Method Not Allowed" });
  }
}
