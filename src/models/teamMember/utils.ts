import { t } from "elysia";
import { basicTeamMember, basicTeamMemberStatistics, basicTeamMemberHighlight } from "./basic";

// Insert
export const insertTeamMember = t.Omit(
    basicTeamMember,
    ["id", "createdAt", "avatar"]
);
export type InsertTeamMember = typeof insertTeamMember.static;

export const insertTeamMemberAttachment = t.Object({
    teamMemberId: t.Number({ minimum: 1 }),
    file: t.File({
        maxSize: "5m",
        type: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"]
    })
});
export type InsertTeamMemberAttachment = typeof insertTeamMemberAttachment.static;

export const insertTeamMemberHighlight = t.Object({
    title: t.String(),
    videoUrl: t.String(),
    teamMemberId: t.Number({ minimum: 1 }),
})
export type InsertTeamMemberHighlight = typeof insertTeamMemberHighlight.static;

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

export const updateTeamMemberHighlight = t.Mapped(
    t.KeyOf(t.Omit(basicTeamMemberHighlight, ["id", "createdAt", "teamMemberId"])),
    K => t.Optional(t.Index(basicTeamMemberHighlight, K))
);
export type UpdateTeamMemberHighlight = typeof updateTeamMemberHighlight.static;
