import { Action, ActionPanel, Detail, Grid, Icon } from "@raycast/api";
import { Player } from "../types";
import { formatDate, getFlagEmoji, getProfileImg } from "../utils";
import { usePromise } from "@raycast/utils";
import { getPlayerInformation, getSeasons } from "../api";

export const PlayerProfile = (props: { id: string }) => {
  const { data: seasons } = usePromise(getSeasons);
  const { data: player } = usePromise(
    async (season, playerId) =>
      season ? await getPlayerInformation(season, playerId) : undefined,
    [seasons?.[0].seasonId, props.id],
  );

  return (
    player && (
      <Detail
        navigationTitle={`${player.name.display} | Profile & Stats`}
        markdown={`## ${player.name.display}
<img src="${getProfileImg(props.id)}" alt="${player.name.display}" width="220" height="280" />
`}
        metadata={
          <Detail.Metadata>
            <Detail.Metadata.Label
              title="Date of Birth"
              text={formatDate(player.dates.birth, "yyyy-MM-dd", "dd MMM yyyy")}
            />
            <Detail.Metadata.Label title="Position" text={player.position} />
            <Detail.Metadata.Label
              title="Nationality"
              icon={getFlagEmoji(player.country.isoCode)}
              text={player.country.country}
            />
            <Detail.Metadata.Label
              title="Place of Birth"
              text={player.countryOfBirth}
            />
            <Detail.Metadata.Separator />
            {player.height && (
              <Detail.Metadata.Label
                title="Height"
                text={`${player.height}cm`}
              />
            )}
            {player.height && (
              <Detail.Metadata.Label
                title="Weight"
                text={`${player.weight}kg`}
              />
            )}
            <Detail.Metadata.Label
              title="Shirt Number"
              text={player.shirtNum?.toString()}
            />
            <Detail.Metadata.Label
              title="Preferred Foot"
              text={player.preferredFoot}
            />
            {player.dates.joinedClub && (
              <Detail.Metadata.Label
                title="Joined Date"
                text={formatDate(
                  player.dates.joinedClub,
                  "yyyy-MM-dd",
                  "dd MMM yyyy",
                )}
              />
            )}
          </Detail.Metadata>
        }
        actions={
          <ActionPanel>
            <Action.OpenInBrowser
              url={`https://www.premierleague.com/en/players/${player.id}/${player.name.display.toLowerCase().replace(/ /g, "-")}/overview`}
            />
          </ActionPanel>
        }
      />
    )
  );
};

export const PositionSection = (players: Player[]) => {
  return players.map((player) => {
    return (
      <Grid.Item
        key={player.id}
        title={player.name.display}
        subtitle={player.position}
        keywords={[player.position]}
        content={{
          source: getProfileImg(player.id),
          fallback: "player-missing.png",
        }}
        accessory={{
          icon: getFlagEmoji(player.country.isoCode),
          tooltip: player.country.country,
        }}
        actions={
          <ActionPanel>
            <Action.Push
              title="View Profile"
              icon={Icon.Sidebar}
              target={<PlayerProfile {...player} />}
            />
          </ActionPanel>
        }
      />
    );
  });
};
