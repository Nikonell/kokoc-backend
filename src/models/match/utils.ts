import { t } from "elysia";
import { basicMatch, matchResult } from "./basic";

export const insertMatch = t.Omit(basicMatch, ["id", "createdAt"]);
export type InsertMatch = typeof insertMatch.static;

export const updateMatch = t.Mapped(
    t.KeyOf(t.Omit(basicMatch, ["id", "createdAt"])),
    K => t.Optional(t.Index(basicMatch, K))
);
export type UpdateMatch = typeof updateMatch.static;
export const matchFilters = t.Object({
    page: t.Number({default: 0}),
    limit: t.Number({default: 10}),
    startDate: t.Optional(t.Date()),
    endDate: t.Optional(t.Date()),
    result: t.Optional(t.Array(matchResult)),
    name: t.Optional(t.String()),
});
export type MatchFilters = typeof matchFilters.static;
