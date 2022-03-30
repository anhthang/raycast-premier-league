import { useEffect, useState } from "react";
import { getPlayers } from "../api";
import { PlayerContent } from "../types";

const usePlayers = (season: string) => {
  const [players, setPlayers] = useState<PlayerContent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (season) {
      setLoading(true);
      getPlayers(season).then((data) => {
        setPlayers(data);
        setLoading(false);
      });
    }
  }, [season]);

  return { players, loading };
};

export default usePlayers;
