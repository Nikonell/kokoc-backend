import { t } from "elysia";
import { basicSecondTeamComposition } from "./basic";

export const insertSecondTeamComposition = t.Omit(basicSecondTeamComposition, ["id"]);
export type InsertSecondTeamComposition = typeof insertSecondTeamComposition.static;

export const updateSecondTeamComposition = t.Mapped(
    t.KeyOf(t.Omit(basicSecondTeamComposition, ["id", "matchId"])),
    K => t.Optional(t.Index(basicSecondTeamComposition, K))
);
export type UpdateSecondTeamComposition = typeof updateSecondTeamComposition.static;

export const secondTeamCompositionFilters = t.Object({
    page: t.Number({default: 0}),
    limit: t.Number({default: 10}),
    matchId: t.Optional(t.Number({minimum: 1})),
});
export type SecondTeamCompositionFilters = typeof secondTeamCompositionFilters.static;
