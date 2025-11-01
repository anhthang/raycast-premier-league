import { getPreferenceValues, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import groupBy from "lodash.groupby";
import { useMemo, useState } from "react";
import { getMatches, getSeasons, getTeams } from "./api";
import Matchday from "./components/matchday";
import SearchBarCompetition, {
  competitions,
} from "./components/searchbar_competition";
import { convertToLocalTime } from "./utils";

const { filter } = getPreferenceValues();

export default function EPLMatchday() {
  const [competition, setCompetition] = useState<string>(competitions[0].value);
  const [teams, setTeams] = useState<string>("-1");

  const { data: seasons = [] } = usePromise(
    (comp) => getSeasons(comp),
    [competition],
  );

  const season = useMemo(() => seasons[0]?.seasonId, [seasons]);

  const { data: clubs } = usePromise(
    async (season) => {
      return season ? await getTeams(season) : [];
    },
    [season],
  );

  const { isLoading, data, pagination } = usePromise(
    (competition, teams, season) => async ({ cursor: _next }) => {
      return await getMatches({
        competition,
        teams,
        season,
        _next,
      });
    },
    [competition, teams, season],
  );
  
  const matchday = groupBy(data, (f) =>
    f.kickoff
      ? convertToLocalTime(f.kickoff, "EEE d MMM yyyy", "yyyy-MM-dd HH:mm:ss")
      : "Date To Be Confirmed",
  );

  return (
    <List
      throttle
      isLoading={isLoading}
      pagination={pagination}
      searchBarAccessory={
        <SearchBarCompetition
          type={filter}
          selected={teams}
          onSelect={filter === "competition" ? setCompetition : setTeams}
          data={filter === "competition" ? competitions : clubs || []}
        />
      }
    >
      {Object.entries(matchday).map(([day, matches]) => {
        return <Matchday key={day} matchday={day} matches={matches} />;
      })}
    </List>
  );
}
