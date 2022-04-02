import { useEffect, useState } from "react";
import { getPlayers } from "../api";
import { PlayerContent } from "../types";

const usePlayers = (team: string, season: number, page: number) => {
  const [players, setPlayers] = useState<PlayerContent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (team) {
      setLoading(true);
      setPlayers([]);

      getPlayers(team, season, page).then((data) => {
        setPlayers(data);
        setLoading(false);
      });
    }
  }, [team, page]);

  return { players, loading };
};

export default usePlayers;
