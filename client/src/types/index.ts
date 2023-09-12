// export interface ITeam {
//   name: string;
//   side: string;
// }

// export interface IPlayer {
//   name: string;
//   side: string;
// }

export enum SeriesEventTypes {
  gridStartedFeed = "grid-started-feed",
  gridEndedFeed = "grid-ended-feed",
  gridInvalidatedSeries = "grid-invalidated-series",
  gridValidatedFeed = "grid-validated-feed",
  teamPickedMap = "team-picked-map",
  teamBannedMap = "team-banned-map",
  seriesPickedMap = "series-picked-map",
  tournamentStartedSeries = "tournament-started-series",
  tournamentEndedSeries = "tournament-ended-series",
  seriesStartedGame = "series-started-game",
  seriesPausedGame = "series-paused-game",
  seriesResumedGame = "series-resumed-game",
  seriesEndedGame = "series-ended-game",
  gameSetClock = "game-set-clock",
  gameStartedClock = "game-started-clock",
  gameStoppedClock = "game-stopped-clock",
  gameStartedRound = "game-started-round",
  gameEndedRound = "game-ended-round",
  roundStartedFreezetime = "round-started-freezetime",
  roundEndedFreezetime = "round-ended-freezetime",
  freezetimeStartedTimeout = "freezetime-started-timeout",
  freezetimeEndedTimeout = "freezetime-ended-timeout",
  teamWonRound = "team-won-round",
  teamWonGame = "team-won-game",
  teamWonSeries = "team-won-series",
  playerCompletedDefuseBomb = "player-completed-defuseBomb",
  playerCompletedBeginDefuseWithKit = "player-completed-beginDefuseWithKit",
  playerCompletedBeginDefuseWithoutKit = "player-completed-beginDefuseWithoutKit",
  playerCompletedPlantBomb = "player-completed-plantBomb",
  playerCompletedExplodeBomb = "player-completed-explodeBomb",
  playerDroppedItem = "player-dropped-item",
  playerPickedUpItem = "player-pickedUp-item",
  playerPurchasedItem = "player-purchased-item",
  playerKilledPlayer = "player-killed-player",
  playerTeamkilledPlayer = "player-teamkilled-player",
  playerSelfkilledPlayer = "player-selfkilled-player",
  playerDamagedPlayer = "player-damaged-player",
  playerSelfdamagedPlayer = "player-selfdamaged-player",
  playerTeamdamagedPlayer = "player-teamdamaged-player",
  playerLeftSeries = "player-left-series",
  playerRejoinedSeries = "player-rejoined-series",
}

// export interface MapEvent {
//   type: SeriesEventTypes.seriesStartedGame;
//   map: string;
//   teams: ITeam[];
// }

// export interface TeamEvent {
//   type: SeriesEventTypes.teamWonRound | SeriesEventTypes.teamWonGame;
//   team: ITeam;
// }

// export interface PlayerEvent {
//   type:
//     | SeriesEventTypes.playerCompletedPlantBomb
//     | SeriesEventTypes.playerCompletedDefuseBomb;
//   player: IPlayer;
// }

// export interface KillEvent {
//   type: SeriesEventTypes.playerKilledPlayer;
//   kill: IPlayer;
//   death: IPlayer;
// }

// export interface RoundEvent {
//   type: SeriesEventTypes.gameStartedRound | SeriesEventTypes.gameEndedRound;
//   round: string;
// }

// export interface DefaultEvent {
//   type: Exclude<
//     SeriesEventTypes,
//     | MapEvent["type"]
//     | TeamEvent["type"]
//     | PlayerEvent["type"]
//     | KillEvent["type"]
//     | RoundEvent["type"]
//   >;
// }

// export type SocketResponse = (
//   | MapEvent
//   | TeamEvent
//   | PlayerEvent
//   | KillEvent
//   | RoundEvent
//   | DefaultEvent
// ) & { id: string };

export interface IQuestion {
  timestamp: any;
  type: "map" | "round" | "bomb";
  active: boolean;
  question: string;
  options: string[];
  bets: IBet[];
  id: string;
}

interface IBet {
  address: string;
  option: number;
  amount: number;
  winnings: number;
}
