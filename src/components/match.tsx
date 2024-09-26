import { Action, ActionPanel, Color, Image, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getFixtureEvents } from "../api";

const iconMap: Record<string, string> = {
  "end 2": "time-full",
  "end 1": "time-half",
  goal: "ball",
  "yellow card": "card-yellow",
  substitution: "sub-on-off",
  "red card": "card-red",
  "secondyellow card": "card-yellow-red",
};

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
        const filename = iconMap[event.type] || "whistle";
        const icon: Image.ImageLike =
          filename === "whistle" || filename.startsWith("time")
            ? {
                source: `match/${filename}.svg`,
                tintColor: Color.PrimaryText,
              }
            : `match/${filename}.svg`;

        const title = ["end 14", "lineup", "start"].includes(event.type)
          ? event.text
          : String(event.time?.label);

        const subtitle = ["end 14", "lineup", "start"].includes(event.type)
          ? ""
          : event.text;

        return (
          <List.Item
            key={event.id}
            title={title}
            subtitle={subtitle}
            icon={icon}
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
