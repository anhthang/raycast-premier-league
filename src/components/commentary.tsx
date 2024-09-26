import { Action, ActionPanel, Color, Image, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getMatchCommentary } from "../api";

const iconMap: Record<string, string> = {
  "end 1": "time-half",
  "end 2": "time-full",
  goal: "goal",
  "own goal": "goal",
  "penalty goal": "goal",
  "red card": "card-red",
  "secondyellow card": "card-yellow-red",
  substitution: "sub-on-off",
  "yellow card": "card-yellow",
};

const transparentIcons = ["whistle", "goal", "time-full", "time-half"];
const textLabelIcons = ["end 14", "lineup", "start"];

export default function MatchCommentary(props: {
  fixture: number;
  match: string;
}) {
  const { isLoading, data, pagination } = usePromise(
    (fixtureId) =>
      async ({ page = 0 }) => {
        return getMatchCommentary(fixtureId, page);
      },
    [props.fixture],
  );

  return (
    <List
      throttle
      isLoading={isLoading}
      pagination={pagination}
      navigationTitle={`${props.match} | Match Commentary`}
    >
      {data?.map((event) => {
        const filename = iconMap[event.type] || "whistle";
        const icon: Image.ImageLike = transparentIcons.includes(filename)
          ? {
              source: `match/${filename}.svg`,
              tintColor:
                event.type === "own goal" ? Color.Red : Color.PrimaryText,
            }
          : `match/${filename}.svg`;

        const title = textLabelIcons.includes(event.type)
          ? event.text
          : `${event.time?.label}'`;

        const subtitle = textLabelIcons.includes(event.type) ? "" : event.text;

        return (
          <List.Item
            key={event.id}
            title={title}
            subtitle={subtitle}
            icon={icon}
            keywords={[title, subtitle]}
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
