import { showFailureToast } from "@raycast/utils";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  EPLContent,
  EPLFixtureEvents,
  EPLPlayer,
  EPLPlayerSearch,
  EPLStaff,
  FixtureEvent,
  Player,
  Report,
  Stat,
  Team,
} from "../types";
import {
  Club,
  EPLAward,
  EPLCompetition,
  EPLPagination,
  EPLStandings,
  Fixture,
  Season,
  Table,
  TeamForm,
} from "../types/sdp";
import { competitions } from "../components/searchbar_competition";

const competition = competitions[0].value;

const endpoint = "https://footballapi.pulselive.com/football";
const newendpoint =
  "https://sdp-prem-prod.premier-league-prod.pulselive.com/api";

const headers = {
  Origin: "https://www.premierleague.com",
};

const pageSize = 50;

interface Pagination<T> {
  data: T[];
  hasMore: boolean;
  cursor?: string | null;
}

export const getSeasons = async (comp: string = "8"): Promise<Season[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `https://resources.premierleague.com/premierleague25/config/season-config/competitions/${comp}.json`,
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLCompetition> = await axios(config);

    return data.seasons;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getAwards = async (season: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${newendpoint}/v1/competitions/${competition}/seasons/${season}/awards`,
  };

  try {
    const { data }: AxiosResponse<EPLAward> = await axios(config);

    return data;
  } catch (e) {
    showFailureToast(e);

    return undefined;
  }
};

export const getClubs = async (season: string): Promise<Club[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${newendpoint}/v1/competitions/${competition}/seasons/${season}/teams`,
    params: {
      _limit: 60,
    },
  };

  try {
    const { data }: AxiosResponse<EPLPagination<Club>> = await axios(config);

    return data.data;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getTeams = async (
  season: string,
): Promise<{ title: string; value: string }[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${endpoint}/compseasons/${season}/teams`,
    headers,
  };

  try {
    const { data }: AxiosResponse<Team[]> = await axios(config);

    const teams = data.map((team) => ({
      title: team.name,
      value: team.id.toString(),
    }));

    teams.unshift({
      title: "All Clubs",
      value: "-1",
    });

    return teams;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getTeamForm = async (season: string): Promise<TeamForm[]> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${newendpoint}/v1/competitions/${competition}/seasons/${season}/teamform`,
  };

  try {
    const { data }: AxiosResponse<TeamForm[]> = await axios(config);

    return data;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getTables = async (season: string): Promise<Table[]> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${newendpoint}/v5/competitions/${competition}/seasons/${season}/standings`,
  };

  try {
    const { data }: AxiosResponse<EPLStandings> = await axios(config);

    const teamform = await getTeamForm(season);

    if (teamform) {
      data.tables.forEach((table) => {
        table.entries.forEach((entry) => {
          const form = teamform.find((tf) => tf.id === entry.team.id);
          if (form) {
            Object.assign(entry, form);
          }
        });
      });
    }

    return data.tables;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getMatches = async (props: {
  season: string;
  competition: string;
  teams?: string;
  _next?: string;
}): Promise<Pagination<Fixture>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${newendpoint}/v2/matches`,
    params: {
      ...props,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLPagination<Fixture>> = await axios(config);
    const hasMore = data.pagination._next ? true : false;

    return { data: data.data, hasMore, cursor: data.pagination._next };
  } catch (e) {
    showFailureToast(e);

    return { data: [], hasMore: false, cursor: null };
  }
};

export const getFixture = async (
  fixtureId: number,
): Promise<Fixture | undefined> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint}/fixtures/${fixtureId}`,
    params: {
      altIds: true,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<Fixture> = await axios(config);

    return data;
  } catch (e) {
    showFailureToast(e);

    return undefined;
  }
};

export const getMatchReports = async (
  fixtureId: number,
): Promise<Report | undefined> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint.replace(".com/football", ".com/content")}/PremierLeague/text/EN`,
    params: {
      page: 0,
      references: `FOOTBALL_FIXTURE:${fixtureId}`,
      tagNames: "Match Report",
      pageSize: 1,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLContent<Report>> = await axios(config);

    return data.content[0];
  } catch (e) {
    showFailureToast(e);

    return undefined;
  }
};

export const getMatchCommentary = async (
  fixtureId: string,
  page: number,
): Promise<Pagination<FixtureEvent>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint}/fixtures/${fixtureId}/textstream/EN`,
    params: {
      pageSize: 40,
      sort: "desc",
      page,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLFixtureEvents> = await axios(config);
    const hasMore =
      data.events.pageInfo.numPages > data.events.pageInfo.page + 1;

    return { data: data.events.content, hasMore };
  } catch (e) {
    showFailureToast(e);

    return { data: [], hasMore: false };
  }
};

export const getPlayers = async (
  teams: string,
  season: string,
  page: number,
): Promise<Pagination<Player>> => {
  const params: Record<string, string | number | boolean> = {
    pageSize,
    compSeasons: season,
    altIds: true,
    page,
    type: "player",
    id: -1,
    compSeasonId: season,
  };

  if (teams !== "-1") {
    params.teams = teams;
  }

  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint}/players`,
    params,
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLContent<Player>> = await axios(config);
    const hasMore = data.pageInfo.numPages > data.pageInfo.page + 1;

    return { data: data.content, hasMore };
  } catch (e) {
    showFailureToast(e);

    return { data: [], hasMore: false };
  }
};

export const getPlayerStats = async (playerId: number): Promise<Stat[]> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint}/stats/player/${playerId}`,
    params: {
      comps: 1,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLPlayer> = await axios(config);

    return data.stats;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getStaffs = async (team: number, season: string) => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint}/teams/${team}/compseasons/${season}/staff`,
    params: {
      pageSize: 100,
      // compSeasons: season,
      altIds: true,
      page: 0,
      type: "player",
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLStaff> = await axios(config);

    return data;
  } catch (e) {
    showFailureToast(e);

    return undefined;
  }
};

export const getManagers = async (compSeasons: string) => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${endpoint}/teamofficials`,
    params: {
      pageSize: 100,
      compSeasons,
      compCodeForActivePlayer: "EN_PR",
      comps: 1,
      altIds: true,
      type: "manager",
      page: 0,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLContent<Player>> = await axios(config);

    return data.content;
  } catch (e) {
    showFailureToast(e);

    return [];
  }
};

export const getPlayersWithTerms = async (
  terms: string,
  page: number,
): Promise<Pagination<Player>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `https://footballapi.pulselive.com/search/PremierLeague`,
    params: {
      terms: `${terms},${terms}*`,
      type: "player",
      size: pageSize,
      start: page * pageSize,
      fullObjectResponse: true,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<EPLPlayerSearch> = await axios(config);
    const hasMore = data.hits.found !== data.hits.start + data.hits.hit.length;
    const players = data.hits.hit.map((h) => h.response).filter((p) => !!p);

    return { data: players, hasMore };
  } catch (e) {
    showFailureToast(e);

    return { data: [], hasMore: false };
  }
};
