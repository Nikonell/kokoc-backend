import { t } from "elysia";
import { teamStatistics } from "./basic";

// Update
export const updateTeamStatistics = t.Mapped(
    t.KeyOf(t.Omit(teamStatistics, ["id", "createdAt"])),
    K => t.Optional(t.Index(teamStatistics, K))
);
export type UpdateTeamStatistics = typeof updateTeamStatistics.static;
