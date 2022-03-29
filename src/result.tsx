import { Action, ActionPanel, List } from "@raycast/api";
import { useState } from "react";
import groupBy from "lodash.groupby";
import ClubDropdown from "./components/club_dropdown";
import useTeams from "./hooks/useTeams";
import useSeasons from "./hooks/useSeasons";
import useFixtures from "./hooks/useFixtures";

export default function Fixture() {
  const seasons = useSeasons();
  const clubs = useTeams(seasons[0]?.id.toString());

  const [page, setPage] = useState<number>(0);
  const [teams, setTeams] = useState<string>("-1");

  const { fixtures, loading } = useFixtures({
    teams,
    page,
    sort: "desc",
    statuses: "C",
  });

  const categories = groupBy(fixtures, (f) => f.kickoff.label?.split(",")[0]);

  return (
    <List
      throttle
      isLoading={loading}
      searchBarAccessory={<ClubDropdown teams={clubs} onSelect={setTeams} />}
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
                      {/* {!lastPage && (
                        <Action
                          title="Load More"
                          icon={Icon.MagnifyingGlass}
                          onAction={() => {
                            setPage(page + 1);
                          }}
                        />
                      )} */}
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
