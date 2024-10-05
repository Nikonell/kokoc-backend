import { t } from "elysia";
import { basicTeamMember, basicTeamMemberAttachment, basicTeamMemberStatistics } from "./basic";

// Member
export const extendedTeamMember = t.Composite([
    basicTeamMember,
    t.Object({
        statistics: t.Array(basicTeamMemberStatistics),
        attachments: t.Array(basicTeamMemberAttachment),
    })
]);

// Statistics
export const extendedTeamMemberStatistics = t.Composite([
    basicTeamMemberStatistics,
    t.Object({
        teamMember: extendedTeamMember,
    })
]);

// Attachment
export const extendedTeamMemberAttachment = t.Composite([
    basicTeamMemberAttachment,
    t.Object({
        teamMember: extendedTeamMember,
    })
]);
