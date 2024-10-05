import { $Enums } from "@prisma/client";
import { t } from "elysia";

// Role
export const teamRole = t.Enum($Enums.TeamRole);
export type TeamRole = typeof teamRole.static;

// Member
export const basicTeamMember = t.Object({
    id: t.Number(),
    createdAt: t.Date(),
    name: t.String(),
    birthDate: t.Date(),
    role: teamRole,
    info: t.String(),
    avatar: t.Nullable(t.String()),
});
export type BasicTeamMember = typeof basicTeamMember.static;

// Statistics
export const basicTeamMemberStatistics = t.Object({
    id: t.Number(),
    createdAt: t.Date(),
    gamesPlayed: t.Number({ minimum: 0 }),
    goals: t.Number({ minimum: 0 }),
    assists: t.Number({ minimum: 0 }),
    yellowCards: t.Number({ minimum: 0 }),
    redCards: t.Number({ minimum: 0 }),
    teamMemberId: t.Number({ minimum: 1 }),
});
export type BasicTeamMemberStatistics = typeof basicTeamMemberStatistics.static;

// Attachment
export const basicTeamMemberAttachment = t.Object({
    id: t.Number(),
    createdAt: t.Date(),
    filename: t.String(),
    teamMemberId: t.Number({ minimum: 1 }),
});
export type BasicTeamMemberAttachment = typeof basicTeamMemberAttachment.static;
