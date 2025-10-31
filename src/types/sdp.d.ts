export interface EPLAward {
  manager_awards: PlayerAward[];
  player_awards: PlayerAward[];
}

export interface Career {
  seasonsInPremierLeague: string[];
  firstPremierLeagueFixtureId: string;
  seasonsAtCurrentTeam: string[];
}

export interface Country {
  isoCode: string;
  country: string;
  demonym: null | string;
}

export interface CurrentTeam {
  name: string;
  id: string;
  shortName: string;
  loan?: number;
}

export interface Dates {
  joinedClub: Date;
  birth: Date;
}

export interface PlayerAward {
  currentTeam: CurrentTeam;
  date: string;
  country: Country;
  shirtNum: number;
  weight: number;
  dates: Dates;
  type: string;
  countryOfBirth: string;
  name: AwardName;
  id: string;
  position: string;
  preferredFoot: string;
  height: number;
  career: Career;
  role: string;
}

export interface AwardName {
  last: string;
  display: string;
  first: string;
  known?: string;
}
