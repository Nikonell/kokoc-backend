import { $Enums } from "@prisma/client";
import { t } from "elysia";

export const matchResult = t.Enum($Enums.MatchResult);
export type MatchResult = typeof matchResult.static;

export const basicMatch = t.Object({
    id: t.Number({ minimum: 1 }),
    createdAt: t.Date(),
    matchName: t.String(),
    dateTime: t.Date(),
    videoUrl: t.String(),
    secondTeamName: t.String(),
    kokocGoalsScored: t.Number({ minimum: 0 }),
    kokocGoalsConceded: t.Number({ minimum: 0 }),
    secondTeamGoalsScored: t.Number({ minimum: 0 }),
    secondTeamGoalsConceded: t.Number({ minimum: 0 }),
    kokocYellowCards: t.Number({ minimum: 0 }),
    kokocRedCards: t.Number({ minimum: 0 }),
    secondTeamYellowCards: t.Number({ minimum: 0 }),
    secondTeamRedCards: t.Number({ minimum: 0 }),
    result: matchResult,
});
export type BasicMatch = typeof basicMatch.static;
