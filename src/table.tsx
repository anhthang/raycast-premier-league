import { Action, ActionPanel, List, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import json2md from "json2md";
import SeasonDropdown from "./components/season_dropdown";
import { getTables } from "./api";
import { Table } from "./types";

export default function GetTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [season, setSeason] = useState<string>("418");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getTables(season).then((data) => {
      setTables(data);
      setLoading(false);
    });
  }, [season]);

  return (
    <List
      throttle
      searchBarAccessory={<SeasonDropdown onSelect={setSeason} />}
      isLoading={loading}
      isShowingDetail={showPreview}
    >
      {tables.map((table) => {
        return (
          <List.Section key={table.gameWeek} title={table.gameWeek.toString()}>
            {table.entries.map((entry) => {
              const props: Partial<List.Item.Props> = showPreview
                ? {
                    detail: (
                      <List.Item.Detail
                        markdown={json2md([
                          {
                            h1: entry.team.name,
                          },
                          {
                            h2: "Overview",
                          },
                          {
                            p: entry.ground.name
                              ? `Stadium: ${entry.ground.name}`
                              : "",
                          },
                          {
                            p: entry.ground.capacity
                              ? `Capacity: ${entry.ground.capacity}`
                              : "",
                          },
                        ])}
                      />
                    ),
                  }
                : {
                    accessoryTitle: entry.overall.points.toString(),
                    // accessoryIcon: `types/${pokemon.types[0].toLowerCase()}.svg`,
                    // icon: {
                    //   source: pokemon.artwork,
                    //   fallback: "icon.png",
                    // },
                  };

              return (
                <List.Item
                  key={entry.position}
                  title={entry.team.name}
                  subtitle={entry.team.club.abbr}
                  icon={`https://resources.premierleague.com/premierleague/badges/${entry.team.altIds.opta}.svg`}
                  {...props}
                  actions={
                    <ActionPanel>
                      <Action
                        title={showPreview ? "Hide Preview" : "Show Preview"}
                        icon={Icon.Sidebar}
                        onAction={() => setShowPreview(!showPreview)}
                      />
                      <Action.OpenInBrowser
                        title="Visit Club Page"
                        url={`https://www.premierleague.com/clubs/${
                          entry.team.id
                        }/${entry.team.name.replaceAll(" ", "-")}/overview`}
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
