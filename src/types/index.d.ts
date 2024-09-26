export interface EPLContent<T> {
  pageInfo: PageInfo;
  content: T[];
}

export interface EPLFixtureEvents {
  fixture: Fixture;
  events: EPLContent<FixtureEvent>;
}

export interface FixtureEvent {
  id: number;
  persionId: number;
  teamId: number;
  assistId: number;
  clock?: Timestamp;
  time?: Timestamp;
  phase?: string;
  type: string;
  description: string;
  text: string;
  score: Score;
  playerIds?: number[];
}

export interface EPLAward {
  compSeason: CompSeason;
  seasonAwards: Award[];
  monthAwards: Record<string, Award[]>;
}

export interface EPLStaff {
  compSeason: CompSeason;
  team: Team;
  players: Player[];
  officials: Player[];
}

export interface EPLStanding {
  compSeason: CompSeason;
  timestamp: Timestamp;
  live: boolean;
  dynamicallyGenerated: boolean;
  tables: Table[];
}

export interface Award {
  official?: Player;
  award: string;
  awardTypeId: number;
  relatedContent: RelatedContent[];
  player?: Player;
  apiTeam?: Team;
}

export interface RelatedContent {
  type: string;
  reference: string;
}

export interface Fixture {
  gameweek: Gameweek;
  kickoff: Timestamp;
  provisionalKickoff: Timestamp;
  teams: TeamScore[];
  replay: boolean;
  ground: Ground;
  neutralGround: boolean;
  status: string;
  phase: string;
  outcome: string;
  attendance?: number;
  clock?: Timestamp;
  fixtureType: string;
  extraTime: boolean;
  shootout: boolean;
  matchOfficials: MatchOfficial[];
  halfTimeScore: Score;
  teamLists: TeamList[];
  events: FixtureEvent[];
  goals: FixtureEvent[];
  penaltyShootouts: unknown[];
  behindClosedDoors: boolean;
  id: number;
  altIds: AltIDS;
  metadata: Record<string, unknown>;
  _source: string;
}

export interface TeamList {
  teamId: number;
  lineup: Player[];
  substitutes: Player[];
  formation: Formation;
}

export interface Formation {
  label: string;
  players: Array<number[]>;
}

export interface MatchOfficial {
  matchOfficialId: number;
  role: string;
  birth: Birth;
  name: Name;
  id: number;
}

export interface Score {
  homeScore: number;
  awayScore: number;
}

export interface Table {
  gameWeek: number;
  entries: Entry[];
}

export interface Entry {
  team: Team;
  position: number;
  startingPosition: number;
  overall: Stats;
  home: Stats;
  away: Stats;
  annotations?: Annotation[];
  form: Fixture[];
  next: Fixture;
  ground: Ground;
}

export interface Annotation {
  type: string;
  destination: string;
}

export interface Stats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
}

export interface AltIDS {
  opta: string;
}

export interface Gameweek {
  id: number;
  compSeason: CompSeason;
  gameweek: number;
  competitionPhase: CompetitionPhase;
}

export interface CompSeason {
  label: string;
  competition: Competition;
  id: number;
}

export interface Competition {
  abbreviation: string;
  description: string;
  level: string;
  source: string;
  id: number;
  altIds: AltIDS;
}

export interface CompetitionPhase {
  id: number;
  type: string;
  gameweekRange: number[];
}

export interface Ground {
  name: string;
  city: string;
  capacity?: number;
  location?: Location;
  source: string;
  id: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface TeamScore {
  team: Team;
  score: number;
}

export interface Team {
  name: string;
  club: Club;
  teamType: string;
  grounds: Ground[];
  shortName: string;
  id: number;
  altIds: AltIDS;
  metadata: {
    communities_twitter: string;
    club_highlights_internal_url: string;
    club_highlights_internal_description: string;
    communities_facebook: string;
    communities_youtube: string;
    communities_instagram: string;
    communities_URL: string;
  };
}

export interface Club {
  name: string;
  shortName: string;
  abbr: string;
  id: number;
}

export interface PageInfo {
  page: number;
  numPages: number;
  pageSize: number;
  numEntries: number;
}

export interface Timestamp {
  completeness?: number;
  gmtOffset?: number;
  label?: string;
  millis?: number;
  secs?: number;
}

export interface Player {
  active: boolean;
  age: string;
  altIds: AltIDS;
  appearances: number;
  assists?: number;
  awards?: Record<string, PlayerAward[]>;
  birth: Birth;
  captain: boolean;
  cleanSheets: number;
  currentTeam?: Team;
  // debut: Timestamp;
  goals?: number;
  goalsConceded?: number;
  height?: number;
  id: number;
  info: Info;
  joinDate?: Timestamp;
  keyPasses?: number;
  latestPosition: string;
  // leaveDate: null;
  matchPosition: Position;
  matchShirtNumber: number;
  // metadata: null;
  name: Name;
  nationalTeam?: Country;
  officialId: number;
  playerId: number;
  previousTeam?: Team;
  role: string;
  saves?: number;
  shots?: number;
  tackles?: number;
  // teamHistory: null;
  weight?: number;
}

export interface Birth {
  date: Timestamp;
  country: Country;
  place?: string;
}

export interface Country {
  isoCode: string;
  country: string;
  demonym?: string;
}

export interface Info {
  position: string;
  shirtNum?: number;
  positionInfo: string;
  loan?: boolean;
}

export interface Name {
  display: string;
  first: string;
  last: string;
  middle?: string;
}

export interface PlayerAward {
  date: Date;
  compSeason: CompSeason;
  notes?: string;
}

export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface EPLPlayerSearch {
  status: string;
  hits: Hits;
}

export interface Hits {
  cursor: null;
  found: number;
  hit: Hit[];
  start: number;
}

export interface Hit {
  id: string;
  contentType: string;
  response: Player;
}
