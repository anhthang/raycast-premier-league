import { Action, ActionPanel, Color, Icon, Image, List } from "@raycast/api";
import { Content } from "../types";
import { convertToLocalTime } from "../utils";
import MatchEvents from "./match";

interface PropsType {
  matchday: string;
  matches: Content[];
}

export default function Matchday(props: PropsType) {
  const { matchday, matches } = props;

  return (
    <List.Section key={matchday} title={matchday}>
      {matches.map((match) => {
        const time = convertToLocalTime(match.kickoff.label, "HH:mm");

        let icon: Image.ImageLike;
        if (!match.kickoff.label) {
          icon = { source: Icon.Clock };
        } else if (match.status === "L") {
          icon = { source: Icon.Livestream, tintColor: Color.Red };
        } else if (match.status === "C") {
          icon = { source: Icon.CheckCircle, tintColor: Color.Green };
        } else {
          icon = Icon.Calendar;
        }

        const accessories: List.Item.Accessory[] = [
          { text: `${match.ground.name}, ${match.ground.city}` },
          {
            icon: {
              source: "stadium.svg",
              tintColor: Color.SecondaryText,
            },
          },
        ];

        if (match.status === "L") {
          accessories.unshift({
            tag: {
              value: match.clock?.label,
              color: Color.Red,
            },
          });
        }

        const keywords = match.teams
          .map((t) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = t.team.club;
            return Object.values(rest);
          })
          .flat();

        return (
          <List.Item
            key={match.id}
            title={time || "TBC"}
            subtitle={
              match.status === "U"
                ? `${match.teams[0].team.name} - ${match.teams[1].team.name}`
                : `${match.teams[0].team.name} ${match.teams[0].score} - ${match.teams[1].score} ${match.teams[1].team.name}`
            }
            icon={icon}
            accessories={accessories}
            keywords={keywords}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Match">
                  <Action.Push
                    title="Match Commentary"
                    icon={Icon.BulletPoints}
                    target={<MatchEvents fixture={match.id} />}
                  />
                  <Action.OpenInBrowser
                    url={`https://www.premierleague.com/match/${match.id}`}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List.Section>
  );
}
