import { List } from "@raycast/api";
import { usePlayers, useSeasons } from "./hooks";

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function Player() {
  const season = useSeasons();
  const player = usePlayers(season.seasons[0]?.id.toString());

  return (
    <List throttle isLoading={season.loading || player.loading}>
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
                icon: getFlagEmoji(p.nationalTeam.isoCode.slice(0, 2)),
              },
            ]}
          />
        );
      })}
    </List>
  );
}
