import PlayerCardComponent from "@/components/playerCard";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { RiotApi } from "@/modules/riot/riot.api";

import ChampionCard from "@/components/championCard";
import { IChampionDisplayedData } from "@/types/champions/champions";
import { mostPlayedPosition } from "@/utils/utils";
import ChampionsList from "@/components/championsContent/championsList";

const riotApi = RiotApi;
export default function HomePage() {
  const [playerInput, setPlayerInput] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();
  
  //  store the input value in the state players
  const handleAddPlayerCard = async () => {
    const summonerPuuid = (await getSummoner()) as any;
    if (summonerPuuid?.error && summonerPuuid.error?.includes("error")) {
      setError("We are not able to find this account");
      return;
    }
    if (summonerPuuid?.puuid) {
      setPlayers([
        ...players,
        `${summonerPuuid.gameName}#${summonerPuuid.tagLine}`,
      ]);
      setError(null);
      const matches = (await riotApi.getRawMatchList(
        summonerPuuid?.puuid
      )) as any;
      const filteredMatches = await riotApi.getFilteredMatchList(
        summonerPuuid?.puuid,
        matches
      );
      setData(filteredMatches);
    } else {
      return;
    }
  };
  function handleKeyPressed(event: any) {
    if (event.key === "Enter") {
      handleAddPlayerCard();
    }
  }
  async function getSummoner() {
    const summonerName = playerInput.split("#")[0];
    const summonerTag = playerInput.split("#")[1];
    const res = await riotApi.getSummonerPuuid(summonerName, summonerTag);

    return res;
  }
  const pickRate = (data: IChampionDisplayedData) =>
    ((data.totalGames / data.totalFetchedGames) * 100).toFixed(0);
  // find most played position for all champions
  const findPosition = data && Object.values(data)
    .map((champion: any) => champion.positions)
    .flat();
  const position = mostPlayedPosition(findPosition).position;
  console.log(position);
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/4 min-w-[370px] bg-blue-gray h-auto pt-10">
        <div className="flex items center px-8 py-5">
          <h1 className="uppercase text-white font-outfit text-5xl italic font-extrabold">
            players
          </h1>
          <button className="w-[42px] h-[42px] bg-light-green rounded-lg rotate-45 ml-auto">
            <EditOutlinedIcon className="text-white -rotate-45" />
          </button>
        </div>
        <div className="px-8 py-5 ">
          {/* input field */}
          <div className="relative gap-2  h-16 flex w-[320px]  rounded-lg ring-light-green ring-1 p-3">
            <input
              type="text"
              className={`w-full h-full  px-3 py-2 text-gray-400 rounded-lg focus:outline-none caret-light-green ${
                error ? "text-red-500" : ""
              }`}
              placeholder="Game Name + #EX"
              value={playerInput}
              onChange={(e) => {
                setPlayerInput(e.target.value);
                setError(null);
              }}
              onKeyUp={(event) => handleKeyPressed(event)}
            />

            <span className="absolute top-[18px] inset-y-0 right-0 pr-4 ">
              <button
                className="hover:animate-pulse hover:scale-110"
                disabled={playerInput.length === 0}
                type="submit"
                onClick={() => handleAddPlayerCard()}
              >
                <SearchIcon className="text-white rotate-90" />
              </button>
            </span>
          </div>
          {error && (
            <div className="text-red-500 px-4 py-2 font-outfit">{error}</div>
          )}
        </div>

        {players.map((player) => (
          <div key={player} className="px-8 py-5">
            <PlayerCardComponent player={player} />
          </div>
        ))}
      </div>
      {data && (
       <ChampionsList data={data} pickRate={pickRate} position={position} player={players[0]}/>
      )}
    </div>
  );
}
