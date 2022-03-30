import { List } from "@raycast/api";
import { useManagers, useSeasons } from "./hooks";

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function Player() {
  const season = useSeasons();
  const manager = useManagers(season.seasons[0]?.id.toString());

  return (
    <List throttle isLoading={season.loading || manager.loading}>
      {manager.managers.map((p) => {
        return (
          <List.Item
            key={p.id}
            title={p.name.display}
            subtitle={p.currentTeam?.name}
            icon={{
              source: `https://resources.premierleague.com/premierleague/photos/players/40x40/${p.altIds.opta}.png`,
              fallback: "player-missing.png",
            }}
            accessories={[
              {
                text: p.birth.country.country,
              },
              {
                icon: getFlagEmoji(p.birth.country.isoCode.slice(0, 2)),
              },
            ]}
          />
        );
      })}
    </List>
  );
}
