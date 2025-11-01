import { Color, Icon, Image } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { format, parse } from "date-fns";
import { Fixture } from "../types";

export const awardMap: Record<string, string> = {
  // CHAMPIONS: "Premier League Champion",
  // GAME_CHANGER_AWARD: "Game Changer",
  GOTM: "Goal of the Month",
  GOTS: "Goal of the Season",
  GB: "Golden Boot",
  GG: "Golden Glove",
  MOTM: "Manager of the Month",
  MOTS: "Manager of the Season",
  MICOTS: "Most Improbable Comeback",
  MPGOTS: "Most Powerful Goal",
  POTM: "Player of the Month",
  POTS: "Player of the Season",
  PM: "Playmaker",
  SOTM: "Save of the Month",
  SOTS: "Save of the Season",
  YPOTS: "Young Player of the Season",
};

export const getFlagEmoji = (isoCode?: string) => {
  if (!isoCode) return "🏴";

  if (isoCode === "GB-ENG") {
    return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  }
  if (isoCode === "GB-WLS") {
    return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
  }
  if (isoCode === "GB-SCT") {
    return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  }
  if (isoCode === "GB-NIR") {
    // The only official flag in Northern Ireland is the Union Flag of the United Kingdom.
    return "🇬🇧";
  }

  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export const convertToLocalTime = (
  label?: string,
  outputFormat?: string,
  customFormat?: string,
) => {
  if (!label) return undefined;

  const inputFormat = customFormat ?? "yyyy-MM-dd HH:mm:ss";

  if (inputFormat.length === 14 && outputFormat?.length === 5) return undefined;

  const time = label.replace("BST", "+01:00").replace("GMT", "+00:00");

  try {
    return format(
      parse(time, inputFormat, new Date()),
      outputFormat || "EEE d MMM yyyy, HH:mm",
    );
  } catch (error) {
    showFailureToast(error, { message: `Invalid time value: ${label}` });

    return undefined;
  }
};

export const getProfileImg = (optaId: string | undefined) => {
  return `https://resources.premierleague.com/premierleague25/photos/players/110x140/${optaId}.png`;
};

export const getClubLogo = (optaId: string) => {
  return `https://resources.premierleague.com/premierleague25/badges/${optaId}.png`;
};

export const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export const getMatchStatusIcon = (match: Fixture) => {
  let icon: Image.ImageLike;
  if (!match.kickoff) {
    icon = { source: Icon.Clock };
  } else if (match.period === "L") {
    icon = { source: Icon.Livestream, tintColor: Color.Red };
  } else if (match.period === "FullTime") {
    icon = { source: Icon.CheckCircle, tintColor: Color.Green };
  } else {
    icon = Icon.Calendar;
  }

  return icon;
};
