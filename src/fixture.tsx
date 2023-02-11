import {
  Action,
  ActionPanel,
  Color,
  getPreferenceValues,
  Icon,
  Image,
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
    sort: "asc",
    statuses: "U,L",
    comps,
    compSeasons: seasons[0]?.id.toString(),
  });

  const categories = groupBy(fixtures, (f) =>
    convertToLocalTime(f.kickoff.label, "EEE d MMM yyyy")
  );

  return (
    <List
      throttle
      isLoading={!fixtures}
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
          <List.Section
            key={label}
            title={label === "undefined" ? "Date To Be Confirmed" : label}
          >
            {matches.map((match) => {
              const time = convertToLocalTime(match.kickoff.label, "HH:mm");

              let icon: Image.ImageLike;
              if (!match.kickoff.label) {
                icon = {
                  source: Icon.QuestionMarkCircle,
                  tintColor: Color.Yellow,
                };
              } else if (match.status === "L") {
                icon = { source: Icon.Livestream, tintColor: Color.Red };
              } else {
                icon = Icon.Clock;
              }

              const accessories: List.Item.Accessory[] = [
                { text: `${match.ground.name}, ${match.ground.city}` },
                { icon: "stadium.svg" },
              ];

              if (match.status === "L") {
                accessories.unshift({
                  tag: {
                    value: match.clock?.label,
                    color: Color.Red,
                  },
                });
              }

              return (
                <List.Item
                  key={match.id}
                  title={time || "TBC"}
                  subtitle={
                    match.status === "L"
                      ? `${match.teams[0].team.name} ${match.teams[0].score} - ${match.teams[1].score} ${match.teams[1].team.name}`
                      : `${match.teams[0].team.name} - ${match.teams[1].team.name}`
                  }
                  icon={icon}
                  accessories={accessories}
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
