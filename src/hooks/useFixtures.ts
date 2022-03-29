import { useEffect, useState } from "react";
import { getFixtures } from "../api";
import { Content } from "../types/fixture";

interface PropsType {
  teams: string;
  page: number;
  sort: string;
  statuses: string;
}

const useFixtures = (props: PropsType) => {
  const [fixtures, setFixtures] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setFixtures([]);

    getFixtures(props).then((data) => {
      setFixtures(data);
      setLoading(false);
    });
  }, [props.teams]);

  useEffect(() => {
    setLoading(true);

    getFixtures(props).then((data) => {
      const matches = fixtures.concat(data);
      setFixtures(matches);
      setLoading(false);
    });
  }, [props.page]);

  return { fixtures, loading };
};

export default useFixtures;
