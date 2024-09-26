import { Action, ActionPanel, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getFixtureEvents } from "../api";

export default function MatchEvents(props: { fixture: number }) {
  const { isLoading, data, pagination } = usePromise(
    (fixtureId) =>
      async ({ page = 0 }) => {
        return getFixtureEvents(fixtureId, page);
      },
    [props.fixture],
  );

  return (
    <List throttle isLoading={isLoading} pagination={pagination}>
      {data?.map((event) => {
        return (
          <List.Item
            key={event.id}
            title={String(event.time?.label)}
            subtitle={event.text}
            icon="match/whistle.svg"
            actions={
              <ActionPanel>
                <Action.OpenInBrowser
                  url={`https://www.premierleague.com/match/${props.fixture}`}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
