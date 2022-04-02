import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import json2md from "json2md";
import { useState } from "react";
import { usePlayers, useSeasons, useTeams } from "./hooks";
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
          <Detail.Metadata.Label title="Age" text={props.age} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Current Team"
            text={props.currentTeam?.club.name}
          />
          <Detail.Metadata.Label
            title="Previous Team"
            text={props.previousTeam?.club.name}
          />
          <Detail.Metadata.Label
            title="Position"
            text={props.info.positionInfo}
          />
        </Detail.Metadata>
      }
    />
  );
}

export default function Player(props: { club: Club }) {
  const season = useSeasons();
  const team = useTeams(season.seasons[0]?.id.toString());
  const [page, setPage] = useState<number>(0);
  const [teamId, setTeam] = useState<string>(props.club?.id.toString());

  const player = usePlayers(teamId, season.seasons[0]?.id, page);

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
