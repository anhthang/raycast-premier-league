import { Color, List } from "@raycast/api";
import { getAvatarIcon, usePromise } from "@raycast/utils";
import groupBy from "lodash.groupby";
import { useMemo, useState } from "react";
import { getFixture } from "../api";
import { Fixture, FixtureEvent, Player } from "../types";
import { getClubLogo, getProfileImg } from "../utils";

const lineMap: Record<string, string> = {
  G: "Goalkeeper",
  D: "Defenders",
  M: "Midfielders",
  F: "Forwards",
};

function getAccessories(events: FixtureEvent[] = []) {
  const accessories: List.Item.Accessory[] = [];

  events.forEach((event) => {
    const tag = event.clock?.label?.replace("'00", "'");

    switch (event.type) {
      case "B":
        {
          let icon;
          if (event.description === "Y") {
            icon = "match/card-yellow.svg";
          } else if (event.description === "R") {
            icon = "match/card-red.svg";
          } else if (event.description === "YR") {
            icon = "match/card-yellow-red.svg";
          }

          accessories.push({ icon, tag });
        }
        break;
      case "G":
        accessories.push({
          icon: {
            source: "match/goal.svg",
            tintColor: Color.PrimaryText,
          },
          tag,
        });
        break;
      case "O":
        accessories.push({
          icon: {
            source: "match/goal.svg",
            tintColor: Color.Red,
          },
          tag,
        });
        break;
      case "P":
        accessories.push({
          icon: {
            source: "match/goal.svg",
            tintColor: Color.PrimaryText,
          },
          tag: `${tag} (pen)`,
        });
        break;
      case "S":
        accessories.push({
          icon: `match/sub-${event.description.toLowerCase()}.svg`,
          tag,
        });
        break;
      default:
        break;
    }
  });

  return accessories;
}

export default function MatchLineups(props: { match: Fixture; title: string }) {
  const { data, isLoading } = usePromise(getFixture, [props.match.id]);

  const [teamId, setTeamId] = useState<string>(String(data?.teams[0]?.team.id));
  const teamLists = useMemo(
    () => data?.teamLists.find((t) => t?.teamId.toString() === teamId),
    [teamId],
  );
  const club = useMemo(
    () => data?.teams.find((t) => t.team.id.toString() === teamId),
    [teamId],
  );
  const eventMap = groupBy(data?.events, "personId");

  const children = (players: Player[] = []) => {
    return players.map((player) => {
      const accessories = getAccessories(eventMap[player.id]);
      if (player.captain) {
        accessories.unshift({
          icon: getAvatarIcon("C"),
        });
      }

      return (
        <List.Item
          key={player.id}
          icon={{
            source: getProfileImg(player.altIds.opta),
            fallback: "player-missing.png",
          }}
          title={player.matchShirtNumber.toString()}
          subtitle={player.name.display}
          accessories={accessories}
          keywords={[player.name.display]}
        />
      );
    });
  };

  return (
    <List
      throttle
      isLoading={isLoading}
      navigationTitle={`${props.title} | Match Line-ups`}
      searchBarAccessory={
        <List.Dropdown tooltip="Change Team" onChange={setTeamId}>
          {data?.teams.map((team) => {
            return (
              <List.Dropdown.Item
                key={team.team.id}
                value={team.team.id.toString()}
                title={team.team.club.name}
                icon={{
                  source: getClubLogo(team.team.altIds.opta),
                  fallback: "default.png",
                }}
              />
            );
          })}
        </List.Dropdown>
      }
    >
      {teamLists && club ? (
        <List.Item
          title={club.team.club.name}
          accessories={[{ text: teamLists?.formation?.label }]}
          icon={{
            source: getClubLogo(club.team.altIds.opta),
            fallback: "default.png",
          }}
        />
      ) : (
        <List.EmptyView
          icon="premier-league.svg"
          title="No pitch view available yet"
        />
      )}

      {teamLists?.formation
        ? teamLists.formation.players.map((group, idx) => {
            const players = teamLists.lineup.filter((p) =>
              group.includes(p.id),
            );
            return (
              <List.Section
                key={idx}
                title={lineMap[players[0].matchPosition]}
                children={children(players)}
              />
            );
          })
        : Object.entries(lineMap).map(([key, position]) => {
            const players = teamLists?.lineup.filter(
              (p) => p.matchPosition === key,
            );

            return (
              <List.Section
                key={key}
                title={position}
                children={children(players)}
              />
            );
          })}

      <List.Section
        title="Substitutes"
        children={children(teamLists?.substitutes)}
      />
    </List>
  );
}
