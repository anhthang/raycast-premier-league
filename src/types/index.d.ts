export interface EPLClub {
  pageInfo: PageInfo;
  content: TeamTeam[];
}

export interface EPLFixture {
  pageInfo: PageInfo;
  content: Content[];
}

export interface EPLFixtureEvents {
  fixture: Content;
  events: EPLFixtureEvent;
}

export interface EPLFixtureEvent {
  pageInfo: PageInfo;
  content: FixtureEvent[];
}

export interface FixtureEvent {
  id: number;
  time?: Clock;
  type: string;
  text: string;
  playerIds?: number[];
}

export interface EPLPlayer {
  pageInfo: PageInfo;
  content: PlayerContent[];
}

export interface EPLAward {
  compSeason: CompSeason;
  seasonAwards: Award[];
  monthAwards: Record<string, Award[]>;
}

export interface EPLStaff {
  compSeason: CompSeason;
  team: TeamTeam;
  players: PlayerContent[];
  officials: PlayerContent[];
}

export interface EPLStanding {
  compSeason: CompSeason;
  timestamp: Timestamp;
  live: boolean;
  dynamicallyGenerated: boolean;
  tables: Table[];
}

export interface Award {
  official?: PlayerContent;
  award: string;
  awardTypeId: number;
  relatedContent: RelatedContent[];
  player?: PlayerContent;
  apiTeam?: TeamTeam;
}

export interface RelatedContent {
  type: string;
  reference: string;
}

export interface Content {
  gameweek: Gameweek;
  kickoff: Kickoff;
  provisionalKickoff: Kickoff;
  teams: TeamElement[];
  replay: boolean;
  ground: Ground;
  neutralGround: boolean;
  status: string;
  phase: string;
  outcome: string;
  attendance?: number;
  clock?: Clock;
  fixtureType: string;
  extraTime: boolean;
  shootout: boolean;
  goals: Goal[];
  penaltyShootouts: unknown[];
  behindClosedDoors: boolean;
  id: number;
  altIds: AltIDS;
}

export interface Table {
  gameWeek: number;
  entries: Entry[];
}

export interface Entry {
  team: TeamTeam;
  position: number;
  startingPosition: number;
  overall: Stats;
  home: Stats;
  away: Stats;
  annotations?: Annotation[];
  form: Content[];
  next: Content;
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

export interface Clock {
  secs: number;
  label: string;
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

export interface Goal {
  personId: number;
  clock: Clock;
  phase: string;
  type: string;
  description: string;
  assistId?: number;
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

export interface Kickoff {
  completeness: number;
  millis?: number;
  label?: string;
  gmtOffset?: number;
}

export interface TeamElement {
  team: TeamTeam;
  score: number;
}

export interface TeamTeam {
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
  millis: number;
  label: string;
}

export interface PlayerContent {
  active: boolean;
  age: string;
  altIds: AltIDS;
  appearances: number;
  assists?: number;
  awards?: Record<string, PlayerAward[]>;
  birth: Birth;
  cleanSheets: number;
  currentTeam?: TeamTeam;
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
  // metadata: null;
  name: Name;
  nationalTeam?: NationalTeam;
  officialId: number;
  playerId: number;
  previousTeam?: TeamTeam;
  role: string;
  saves?: number;
  shots?: number;
  tackles?: number;
  // teamHistory: null;
  weight?: number;
}

export interface Birth {
  date: Timestamp;
  country: NationalTeam;
  place?: string;
}

export interface NationalTeam {
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
  date: CHAMPIONDate;
  compSeason: CompSeason;
  notes?: string;
}

export interface CHAMPIONDate {
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
  response: PlayerContent;
}
