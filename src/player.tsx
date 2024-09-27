import { Action, ActionPanel, Detail, Grid, Icon } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import json2md from "json2md";
import groupBy from "lodash.groupby";
import { useMemo, useState } from "react";
import {
  getPlayerStats,
  getPlayers,
  getPlayersWithTerms,
  getSeasons,
  getStaffs,
  getTeams,
} from "./api";
import { Club, Player, PlayerAward } from "./types";
import { awardMap, getFlagEmoji, getProfileImg } from "./utils";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function PlayerProfile(props: Player) {
  const { data, isLoading } = usePromise(getPlayerStats, [props.id]);

  const statsMap = groupBy(data, "name");
  const stats = [
    `Appearances: ${statsMap["appearances"]?.[0].value || 0}`,
    `Goals: ${statsMap["goals"]?.[0].value || 0}`,
    `Assists: ${statsMap["goal_assist"]?.[0].value || 0}`,
  ];

  if (props.info.position === "G" || props.info.position === "D") {
    stats.push(`Clean sheets: ${statsMap["clean_sheet"]?.[0].value || 0}`);
  }

  return (
    <Detail
      isLoading={isLoading}
      navigationTitle={`${props.name.display} | Profile & Stats`}
      markdown={json2md([
        { h1: props.name.display },
        {
          img: {
            source: getProfileImg(props.altIds.opta),
          },
        },
        {
          h2: "Premier League Record",
        },
        {
          p: stats,
        },
        {
          h2: props.awards ? "Honours & Awards" : "",
        },
        ...Object.entries(props.awards || {})
          .map(([key, awards]) => {
            return [
              {
                h3: awardMap[key] || key,
              },
              {
                ul: awards.map((award: PlayerAward) => {
                  const month = Array.isArray(award.date)
                    ? award.date[1]
                    : award.date.month;
                  return key.endsWith("MONTH")
                    ? `${months[month - 1]} ${award.compSeason.label}`
                    : award.compSeason.label;
                }),
              },
            ];
          })
          .flat(),
      ])}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Nationality"
            icon={getFlagEmoji(props.nationalTeam?.isoCode)}
            text={props.nationalTeam?.country}
          />
          <Detail.Metadata.Label
            title="Date of Birth"
            text={props.birth.date.label}
          />
          {props.height && (
            <Detail.Metadata.Label title="Height" text={`${props.height}cm`} />
          )}
          <Detail.Metadata.Label title="Age" text={props.age} />
          <Detail.Metadata.Separator />
          {props.currentTeam && (
            <Detail.Metadata.Label title="Club" text={props.currentTeam.name} />
          )}
          {props.joinDate && (
            <Detail.Metadata.Label
              title="Joined Date"
              text={props.joinDate?.label}
            />
          )}
          <Detail.Metadata.Label
            title="Position"
            text={props.info.positionInfo}
          />
          <Detail.Metadata.Label
            title="Shirt Number"
            text={props.info.shirtNum?.toString()}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            url={`https://www.premierleague.com/players/${
              props.id
            }/${props.name.display.replace(/ /g, "-")}/overview`}
          />
        </ActionPanel>
      }
    />
  );
}

export default function EPLPlayer(props: { club: Club }) {
  const [teamId, setTeam] = useState<string>(props.club?.id.toString() ?? "-1");

  const { data: seasons = [] } = usePromise(getSeasons);

  const compSeasons = useMemo(() => seasons[0]?.id.toString(), [seasons]);

  const { data: teams } = usePromise(
    async (season) => {
      return season ? await getTeams(season) : [];
    },
    [compSeasons],
  );

  const [terms, setTerms] = useState<string>("");

  const { isLoading, data, pagination } = usePromise(
    (season, team, terms) =>
      async ({ page = 0 }) => {
        if (terms.length >= 3) {
          return getPlayersWithTerms(terms, page);
        } else if (team && season) {
          if (team === "-1") {
            return getPlayers(team, season, page);
          } else if (!page) {
            // prevent duplicate data when going back to club squads from player profile
            return getStaffs(team, season);
          }
        }

        return { data: [], hasMore: false };
      },
    [compSeasons, teamId, terms],
  );

  const listProps: Partial<Grid.Props> = props.club
    ? {
        navigationTitle: `Squad | ${props.club.name} | Club`,
      }
    : {
        navigationTitle: "Players",
        searchBarAccessory: (
          <Grid.Dropdown
            tooltip="Filter by Club"
            value={teamId}
            onChange={setTeam}
          >
            {teams?.map((s) => {
              return (
                <Grid.Dropdown.Item
                  key={s.value}
                  value={s.value}
                  title={s.title}
                />
              );
            })}
          </Grid.Dropdown>
        ),
      };

  if (teamId === "-1") {
    listProps.searchText = terms;
    listProps.onSearchTextChange = setTerms;
  }

  // console.log(data && data[0])
  const positions = groupBy(data, "latestPosition");

  return (
    <Grid throttle isLoading={isLoading} pagination={pagination} {...listProps}>
      {props.club && (
        <Grid.EmptyView
          icon="empty.png"
          title="We don't have any data on this club."
        />
      )}
      {!props.club && terms.length < 3 && (
        <Grid.EmptyView
          icon="player-missing.png"
          title="Search terms length must be at least 3 characters long."
        />
      )}
      {(!terms || terms.length >= 3) &&
        Object.entries(positions).map(([position, players]) => {
          return (
            <Grid.Section
              key={position}
              title={`${position.charAt(0).toUpperCase()}${position.slice(1).toLowerCase()}`}
            >
              {players.map((player) => {
                return (
                  <Grid.Item
                    key={player.id}
                    title={player.name.display}
                    subtitle={player.info.positionInfo}
                    keywords={[player.info.positionInfo]}
                    content={{
                      source: getProfileImg(player.altIds.opta),
                      fallback: "player-missing.png",
                    }}
                    actions={
                      <ActionPanel>
                        <Action.Push
                          title="View Player"
                          icon={Icon.Sidebar}
                          target={<PlayerProfile {...player} />}
                        />
                      </ActionPanel>
                    }
                  />
                );
              })}
            </Grid.Section>
          );
        })}
    </Grid>
  );
}
