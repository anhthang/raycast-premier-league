import { useEffect, useState } from "react";
import { getSeasons } from "../api";

interface Season {
  label: string;
  id: number;
}

const useSeasons = (): Season[] => {
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    getSeasons().then(setSeasons);
  }, []);

  return seasons;
};

export default useSeasons;
