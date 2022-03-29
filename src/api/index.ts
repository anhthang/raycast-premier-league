import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { showToast, Toast } from "@raycast/api";
import { PremierLeague, Table, TeamTeam } from "../types/table";
import { Content, Fixture } from "../types/fixture";

function showFailureToast() {
  showToast(
    Toast.Style.Failure,
    "Something went wrong",
    "Please try again later"
  );
}

const headers = {
  Origin: "https://www.premierleague.com",
};

export const getSeasons = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "https://footballapi.pulselive.com/football/competitions/1/compseasons",
    params: {
      page: 0,
      pageSize: 100,
    },
    headers,
  };

  try {
    const { data } = await axios(config);

    return data.content;
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getTeams = async (season: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `https://footballapi.pulselive.com/football/compseasons/${season}/teams`,
    headers,
  };

  try {
    const { data }: AxiosResponse<TeamTeam[]> = await axios(config);

    return data;
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getTables = async (seasonId: string): Promise<Table[]> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `https://footballapi.pulselive.com/football/standings`,
    params: {
      compSeasons: seasonId,
      altIds: true,
      detail: 2,
      FOOTBALL_COMPETITION: 1,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<PremierLeague> = await axios(config);

    return data.tables;
  } catch (e) {
    showFailureToast();

    return [];
  }
};

export const getFixtures = async (props: {
  teams?: string;
  page: number;
  sort: string;
  statuses: string;
}): Promise<Content[]> => {
  if (props.teams === "-1") {
    delete props.teams;
  }

  const config: AxiosRequestConfig = {
    method: "get",
    url: `https://footballapi.pulselive.com/football/fixtures`,
    params: {
      comps: 1,
      pageSize: 40,
      altIds: true,
      ...props,
    },
    headers,
  };

  try {
    const { data }: AxiosResponse<Fixture> = await axios(config);

    return data.content;
  } catch (e) {
    showFailureToast();

    return [];
  }
};
