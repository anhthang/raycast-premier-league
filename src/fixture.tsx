import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import groupBy from "lodash.groupby";
import { format, parse } from "date-fns";
import { getFixtures } from "./api";
import { Content } from "./types/fixture";
import ClubDropdown from "./components/club_dropdown";

export default function Fixture() {
  const [fixtures, setFixtures] = useState<Content[]>([]);
  const [lastPage, setLastPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [club, setClub] = useState<string>("-1");
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    setFixtures([]);
    setPage(0);

    getFixtures(club, page, "asc", "U,L").then((data) => {
      setFixtures(data);
      setLoading(false);
    });
  }, [club]);

  useEffect(() => {
    setLoading(true);

    getFixtures(club, page, "asc", "U,L").then((data) => {
      const matches = fixtures.concat(data);
      if (data.length === 0) {
        setLastPage(true);
      }
      setFixtures(matches);
      setLoading(false);
    });
  }, [page]);

  const categories = groupBy(fixtures, (f) => f.kickoff.label?.split(",")[0]);

  return (
    <List
      throttle
      isLoading={loading}
      searchBarAccessory={<ClubDropdown onSelect={setClub} />}
    >
      {Object.entries(categories).map(([label, matches]) => {
        return (
          <List.Section
            key={label}
            title={label === "undefined" ? "Date To Be Confirmed" : label}
          >
            {matches.map((match) => {
              const label = match.kickoff.label
                ?.replace("BST", "+01:00")
                .replace("GMT", "+00:00");
              const kickoff = label
                ? format(
                    parse(label, "EEE d MMM yyyy, HH:mm XXX", new Date()),
                    "HH:mm"
                  )
                : "TBC";

              return (
                <List.Item
                  key={match.id}
                  title={kickoff}
                  subtitle={`${match.teams[0].team.name} - ${match.teams[1].team.name}`}
                  icon={Icon.Clock}
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
