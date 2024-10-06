import { t } from "elysia";
import { basicTeamMember, basicTeamMemberAttachment, basicTeamMemberHighlight, basicTeamMemberStatistics } from "./basic";

// Member
export const extendedTeamMember = t.Composite([
    basicTeamMember,
    t.Object({
        statistics: t.Nullable(basicTeamMemberStatistics),
        attachments: t.Array(basicTeamMemberAttachment),
    })
]);
export type ExtendedTeamMember = typeof extendedTeamMember.static;

// Statistics
export const extendedTeamMemberStatistics = t.Composite([
    basicTeamMemberStatistics,
    t.Object({
        teamMember: basicTeamMember,
    })
]);
export type ExtendedTeamMemberStatistics = typeof extendedTeamMemberStatistics.static;

// Attachment
export const extendedTeamMemberAttachment = t.Composite([
    basicTeamMemberAttachment,
    t.Object({
        teamMember: basicTeamMember,
    })
]);
export type ExtendedTeamMemberAttachment = typeof extendedTeamMemberAttachment.static;

// Highlight
export const extendedTeamMemberHighlight = t.Composite([
    basicTeamMemberHighlight,
    t.Object({
        teamMember: basicTeamMember,
    })
]);
export type ExtendedTeamMemberHighlight = typeof extendedTeamMemberHighlight.static;
