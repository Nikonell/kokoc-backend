import { t } from "elysia";
import { basicTeamMember, basicTeamMemberStatistics } from "./basic";

// Insert
export const insertTeamMember = t.Omit(
    basicTeamMember,
    ["id", "createdAt", "avatar"]
);
export type InsertTeamMember = typeof insertTeamMember.static;

// Update
export const updateTeamMember = t.Mapped(
    t.KeyOf(t.Omit(basicTeamMember, ["id", "createdAt", "avatar"])),
    K => t.Optional(t.Index(basicTeamMember, K))
);
export type UpdateTeamMember = typeof updateTeamMember.static;

export const updateTeamMemberStatistics = t.Mapped(
    t.KeyOf(t.Omit(basicTeamMemberStatistics, ["id", "createdAt", "teamMemberId"])),
    K => t.Optional(t.Index(basicTeamMemberStatistics, K))
);
export type UpdateTeamMemberStatistics = typeof updateTeamMemberStatistics.static;
