import { Grid } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { getAwards } from "./api";
import SearchBarSeason from "./components/searchbar_season";
import {
  awardMap,
  convertToLocalTime,
  getClubLogo,
  getProfileImg,
} from "./utils";

export default function Award() {
  const [seasonId, setSeasonId] = useState<string>();

  const { data: awards, isLoading } = usePromise(
    async (season) => (season ? await getAwards(season) : undefined),
    [seasonId],
  );

  return (
    <Grid
      throttle
      isLoading={isLoading}
      columns={4}
      searchBarAccessory={
        <SearchBarSeason selected={seasonId} onSelect={setSeasonId} />
      }
    >
      {awards?.seasonAwards.map((award) => {
        return (
          <Grid.Item
            key={award.awardTypeId}
            title={
              award.official?.name.display ||
              award.player?.name.display ||
              award.apiTeam?.name
            }
            subtitle={awardMap[award.award]}
            content={{
              source: award.apiTeam
                ? getClubLogo(award.apiTeam.altIds.opta)
                : getProfileImg(
                    award.official?.altIds.opta || award.player?.altIds.opta,
                  ),
              fallback: "player-missing.png",
            }}
          />
        );
      })}
      {Object.entries(awards?.monthAwards || {})
        .reverse()
        .map(([date, monthAwards]) => {
          return (
            <Grid.Section
              title={convertToLocalTime(date, "MMMM yyyy", "yyyy-MM-dd")}
              key={date}
            >
              {monthAwards.map((award) => {
                return (
                  <Grid.Item
                    key={award.awardTypeId}
                    title={
                      award.official?.name.display || award.player?.name.display
                    }
                    subtitle={awardMap[award.award]}
                    content={{
                      source: getProfileImg(
                        award.official?.altIds.opta ||
                          award.player?.altIds.opta,
                      ),
                      fallback: "player-missing.png",
                    }}
                  />
                );
              })}
            </Grid.Section>
          );
        })}
    </Grid>
  );
}
