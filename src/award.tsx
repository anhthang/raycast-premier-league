import { Grid } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { getAwards, getSeasons } from "./api";
import {
  awardMap,
  convertToLocalTime,
  getClubLogo,
  getProfileImg,
} from "./utils";

export default function Award() {
  const { data: seasons = [] } = usePromise(getSeasons);
  const { data: awards, isLoading } = usePromise(
    async (season) => (season ? await getAwards(season) : undefined),
    [seasons[0]?.id.toString()],
  );

  const [awardType, setAwardType] = useState<string>("monthAwards");

  return (
    <Grid
      throttle
      isLoading={isLoading}
      columns={4}
      searchBarAccessory={
        <Grid.Dropdown tooltip="Filter by Type" onChange={setAwardType}>
          <Grid.Dropdown.Item title="Month" value="month"></Grid.Dropdown.Item>
          <Grid.Dropdown.Item
            title="Season"
            value="season"
          ></Grid.Dropdown.Item>
        </Grid.Dropdown>
      }
    >
      {awardType === "month"
        ? Object.entries(awards?.monthAwards || {})
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
                          award.official?.name.display ||
                          award.player?.name.display
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
            })
        : awards?.seasonAwards.map((award) => {
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
                        award.official?.altIds.opta ||
                          award.player?.altIds.opta,
                      ),
                  fallback: "player-missing.png",
                }}
              />
            );
          })}
    </Grid>
  );
}
