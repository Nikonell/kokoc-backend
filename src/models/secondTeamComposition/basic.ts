import { t } from "elysia";
import { teamRole } from "../teamMember/basic";

export const basicSecondTeamComposition = t.Object({
    id: t.Number({ minimum: 1 }),
    name: t.String(),
    role: teamRole,
    matchId: t.Number({ minimum: 1 }),
});
export type BasicSecondTeamComposition = typeof basicSecondTeamComposition.static;
