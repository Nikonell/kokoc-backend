import { $Enums } from "@prisma/client";
import { t } from "elysia";

// Role
export const teamRole = t.Enum($Enums.ColumnCategory);
export type TeamRole = typeof teamRole.static;

// Member
export const basicTeamMember = t.Object({
    id: t.String(),
    createdAt: t.Date(),
    name: t.String(),
    birthDate: t.Date(),
    role: teamRole,
    avatar: t.String(),
    info: t.String(),
});

// Statistics
export const basicTeamMemberStatistics = t.Object({
    id: t.String(),
    createdAt: t.Date(),
    gamesPlayed: t.Number({ minimum: 0 }),
    goals: t.Number({ minimum: 0 }),
    assists: t.Number({ minimum: 0 }),
    yellowCards: t.Number({ minimum: 0 }),
    redCards: t.Number({ minimum: 0 }),
    teamMemberId: t.Number({ minimum: 1 }),
});

// Attachment
export const basicTeamMemberAttachment = t.Object({
    id: t.String(),
    createdAt: t.Date(),
    filename: t.String(),
    teamMemberId: t.Number({ minimum: 1 }),
})
