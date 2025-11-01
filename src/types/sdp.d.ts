export interface EPLAward {
  manager_awards: PlayerAward[];
  player_awards: PlayerAward[];
}

export interface EPLStandings {
  matchweek: number;
  tables: Table[];
  season: SeasonInfo;
  competition: Competition;
  deductions: unknown[];
  live: boolean;
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

export interface Team {
  name: string;
  id: string;
  shortName: string;
  abbr: string;
  loan?: number;
  score: number;
  halfTimeScore: number;
  redCards: number;
}

export interface Dates {
  joinedClub: Date;
  birth: Date;
}

export interface PlayerAward {
  currentTeam: Team;
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

export interface Competition {
  code: string;
  name: string;
  id: string;
}

export interface Table {
  entries: Entry[];
}

export interface Entry {
  away: TeamStats;
  overall: TeamStats;
  team: Team;
  home: TeamStats;
  form?: Fixture[];
  next?: Fixture;
}

export interface TeamStats {
  goalsFor: number;
  lost: number;
  won: number;
  position: number;
  drawn: number;
  goalsAgainst: number;
  played: number;
  points: number;
  startingPosition?: number;
}

export interface TeamForm extends Team {
  next: Fixture;
  form: Fixture[];
}

export interface Fixture {
  kickoffTimezone: string;
  competitionId: string;
  period: string;
  matchWeek: number;
  kickoff: string;
  awayTeam: Team;
  seasonInfo: SeasonInfo;
  competition: string;
  clock: string;
  kickoffTimezoneString: string;
  seasonId: string;
  homeTeam: Team;
  ground: string;
  resultType: string;
  matchId: string;
  attendance?: number;
}

export interface SeasonInfo {
  name: string;
  id: string;
}

export interface EPLCompetition {
  competitionId: string;
  competitionLabel: string;
  seasons: Season[];
}

export interface Season {
  seasonId: string;
  label: string;
  annotations: Annotation[];
  qualification: Qualification[];
  relegation: string[];
}

export interface Annotation {
  teamId?: string;
  comment: string;
}

export interface Qualification {
  competitionId: string;
  label: string;
  positions: string[];
  teamIds?: string[];
}
