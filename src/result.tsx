import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Icon,
  List,
} from "@raycast/api";
import { useState } from "react";
import groupBy from "lodash.groupby";
import { useFixtures, useSeasons, useTeams } from "./hooks";
import { convertToLocalTime } from "./utils";
import SearchBarAccessory, { competitions } from "./components/searchbar";

const { filter } = getPreferenceValues();

export default function Fixture() {
  const [comps, setCompetition] = useState<string>(competitions[0].value);

  const seasons = useSeasons(comps);
  const clubs = useTeams(seasons[0]?.id.toString());

  const [page, setPage] = useState<number>(0);
  const [teams, setTeams] = useState<string>("-1");

  const { fixtures, lastPage } = useFixtures({
    teams,
    page,
    sort: "desc",
    statuses: "C",
    comps,
    compSeasons: seasons[0]?.id.toString(),
  });

  const categories = groupBy(fixtures, (f) =>
    convertToLocalTime(f.kickoff.label, "EEE d MMM yyyy")
  );

  return (
    <List
      throttle
      isLoading={!clubs || !fixtures}
      searchBarAccessory={
        filter === "competition" ? (
          <SearchBarAccessory
            type={filter}
            selected={comps}
            onSelect={setCompetition}
          />
        ) : (
          <SearchBarAccessory
            type={filter}
            selected={teams}
            onSelect={setTeams}
            clubs={clubs}
          />
        )
      }
    >
      {Object.entries(categories).map(([label, matches]) => {
        return (
          <List.Section key={label} title={label}>
            {matches.map((match) => {
              return (
                <List.Item
                  key={match.id}
                  title={`${match.teams[0].team.name} ${match.teams[0].score} - ${match.teams[1].score} ${match.teams[1].team.name}`}
                  accessories={[
                    { text: `${match.ground.name}, ${match.ground.city}` },
                    { icon: "stadium.svg" },
                  ]}
                  actions={
                    <ActionPanel>
                      <Action.OpenInBrowser
                        url={`https://www.premierleague.com/match/${match.id}`}
                      />
                      {!lastPage && (
                        <Action
                          title="Load More"
                          icon={Icon.MagnifyingGlass}
                          onAction={() => {
                            setPage(page + 1);
                          }}
                        />
                      )}
                    </ActionPanel>
                  }
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
