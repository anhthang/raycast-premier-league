import { Action, ActionPanel, List, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import json2md from "json2md";
import SeasonDropdown from "./components/season_dropdown";
import { getTables } from "./api";
import { Entry, Table } from "./types";

export default function GetTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [season, setSeason] = useState<string>("418");
  const [loading, setLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getTables(season).then((data) => {
      setTables(data);
      setLoading(false);
    });
  }, [season]);

  const club = (entry: Entry): json2md.DataObject => {
    const { overall, team, ground } = entry;

    return [
      { h1: team.name },
      { h2: "Overview" },
      { p: ground.name ? `Stadium: ${ground.name}, **${ground.city}**` : "" },
      { p: ground.capacity ? `Capacity: ${ground.capacity}` : "" },
      { h2: "Stats" },
      { p: `Played: ${overall.played}` },
      { p: `Won: ${overall.won}` },
      { p: `Drawn: ${overall.drawn}` },
      { p: `Lost: ${overall.lost}` },
      { p: `Goals For: ${overall.goalsFor}` },
      { p: `Goals Against: ${overall.goalsAgainst}` },
      { p: `Goal Difference: ${overall.goalsDifference}` },
    ];
  };

  return (
    <List
      throttle
      searchBarAccessory={<SeasonDropdown onSelect={setSeason} />}
      isLoading={loading}
      isShowingDetail={showDetails}
    >
      {tables.map((table) => {
        return (
          <List.Section key={table.gameWeek}>
            {table.entries.map((entry) => {
              const { overall, team, position, ground, next } = entry;

              const props: Partial<List.Item.Props> = showDetails
                ? {
                    accessoryTitle: overall.points.toString(),
                    detail: (
                      <List.Item.Detail markdown={json2md(club(entry))} />
                    ),
                  }
                : {
                    subtitle: team.club.abbr,
                    accessoryTitle: `Played: ${overall.played} Points: ${overall.points}`,
                  };

              if (!showDetails && next) {
                const nextTeam =
                  ground.id === next.ground.id ? next.teams[1] : next.teams[0];
                props.accessoryIcon = `https://resources.premierleague.com/premierleague/badges/${nextTeam.team.altIds.opta}.svg`;
              }

              return (
                <List.Item
                  key={position}
                  title={`${position}. ${team.name}`}
                  icon={{
                    source: `https://resources.premierleague.com/premierleague/badges/${team.altIds.opta}.svg`,
                    fallback: "icon.png",
                  }}
                  {...props}
                  actions={
                    <ActionPanel>
                      <Action
                        title={showDetails ? "Hide Details" : "Show Details"}
                        icon={Icon.Sidebar}
                        onAction={() => setShowDetails(!showDetails)}
                      />
                      <Action.OpenInBrowser
                        title="Visit Club Page"
                        url={`https://www.premierleague.com/clubs/${
                          team.id
                        }/${team.name.replaceAll(" ", "-")}/overview`}
                      />
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
