import { Grid } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import groupBy from "lodash.groupby";
import { useState } from "react";
import { getPlayersWithTerms } from "./api";
import { PositionSection } from "./components/player";
import { positionMap } from "./utils";

export default function EPLPlayer() {
  const [terms, setTerms] = useState<string>("");

  const { isLoading, data, pagination } = usePromise(
    (terms) =>
      async ({ page = 0 }) => {
        return terms && terms.length >= 3
          ? await getPlayersWithTerms(terms, page)
          : { data: [], hasMore: false };
      },
    [terms],
  );

  const positions = groupBy(data, "info.position");

  return (
    <Grid
      throttle
      isLoading={isLoading}
      pagination={pagination}
      searchText={terms}
      onSearchTextChange={setTerms}
      navigationTitle="Players"
    >
      {!terms || terms.length < 3 ? (
        <Grid.EmptyView
          icon="premier-league.svg"
          title="Please enter a search term with at least 3 characters."
        />
      ) : (
        Object.entries(positionMap).map(([key, value]) => {
          const players = positions[key] || [];

          return (
            <Grid.Section
              key={key}
              title={value}
              children={PositionSection(players)}
            />
          );
        })
      )}
    </Grid>
  );
}
