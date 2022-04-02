import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import json2md from "json2md";
import { useState } from "react";
import { usePlayers, useSeasons, useStaffs, useTeams } from "./hooks";
import { Club, PlayerContent } from "./types";
import { getFlagEmoji } from "./utils";

function PlayerProfile(props: PlayerContent) {
  return (
    <Detail
      navigationTitle={`${props.name.display} | Profile`}
      markdown={json2md([
        { h1: props.name.display },
        {
          img: {
            source: `https://resources.premierleague.com/premierleague/photos/players/250x250/${props.altIds.opta}.png`,
          },
        },
      ])}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Nationality"
            text={props.nationalTeam.country}
          />
          <Detail.Metadata.Label
            title="Date of Birth"
            text={props.birth.date.label}
          />
          <Detail.Metadata.Label
            title="Height (cm)"
            text={props.height?.toString()}
          />
          <Detail.Metadata.Label title="Age" text={props.age} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Joined Date"
            text={props.joinDate?.label}
          />
          <Detail.Metadata.Label
            title="Position"
            text={props.info.positionInfo}
          />
          <Detail.Metadata.Label
            title="Shirt Number"
            text={props.info.shirtNum?.toString()}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            url={`https://www.premierleague.com/players/${
              props.id
            }/${props.name.display.replace(/ /g, "-")}/overview`}
          />
        </ActionPanel>
      }
    />
  );
}

export default function Player(props: { club: Club }) {
  const [teamId, setTeam] = useState<string>(props.club?.id.toString() ?? "-1");

  const season = useSeasons();
  const seasonId = season.seasons[0]?.id.toString();
  const team = useTeams(seasonId);

  const [page, setPage] = useState<number>(0);

  const player =
    teamId === "-1"
      ? usePlayers(teamId, seasonId, page)
      : useStaffs(teamId, seasonId);

  return (
    <List
      throttle
      navigationTitle={
        props.club ? `Squad | ${props.club.name} | Club` : "Players"
      }
      isLoading={season.loading || player.loading}
      searchBarAccessory={
        props.club ? undefined : (
          <List.Dropdown tooltip="Filter by Club" onChange={setTeam}>
            {team.clubs.map((s) => {
              return (
                <List.Dropdown.Item
                  key={s.value}
                  value={s.value}
                  title={s.title}
                />
              );
            })}
          </List.Dropdown>
        )
      }
    >
      {player.players.map((p) => {
        return (
          <List.Item
            key={p.id}
            title={p.name.display}
            subtitle={p.info.positionInfo}
            icon={{
              source: `https://resources.premierleague.com/premierleague/photos/players/40x40/${p.altIds.opta}.png`,
              fallback: "player-missing.png",
            }}
            accessories={[
              {
                text: p.nationalTeam.country,
              },
              {
                icon: getFlagEmoji(p.nationalTeam.isoCode),
              },
            ]}
            actions={
              <ActionPanel>
                <Action.Push
                  title="Show Details"
                  icon={Icon.Sidebar}
                  target={<PlayerProfile {...p} />}
                />
                <Action
                  title="Next Page"
                  icon={Icon.ArrowRight}
                  onAction={() => {
                    setPage(page + 1);
                  }}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
