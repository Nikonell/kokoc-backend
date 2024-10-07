import { t } from "elysia";

// Basic
export const teamStatistics = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    gamesPlayed: t.Number({ minimum: 0 }),
    wins: t.Number({ minimum: 0 }),
    winsOvertime: t.Number({ minimum: 0 }),
    winsPenalty: t.Number({ minimum: 0 }),
    losses: t.Number({ minimum: 0 }),
    lossesOvertime: t.Number({ minimum: 0 }),
    lossesPenalty: t.Number({ minimum: 0 }),
    goalsScored: t.Number({ minimum: 0 }),
    goalsConceded: t.Number({ minimum: 0 }),
    yellowCards: t.Number({ minimum: 0 }),
    redCards: t.Number({ minimum: 0 }),
    cleanSheets: t.Number({ minimum: 0 }),
});
export type TeamStatistics = typeof teamStatistics.static;
