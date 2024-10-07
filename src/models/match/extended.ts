import { t } from "elysia";
import { basicMatch } from "./basic";
import { basicComment } from "../comment/basic";
import { basicTeamMember } from "../teamMember/basic";
import { basicSecondTeamComposition } from "../secondTeamComposition/basic";

export const extendedMatch = t.Composite([
    basicMatch,
    t.Object({
        kokocComposition: t.Array(basicTeamMember),
        secondTeamComposition: t.Array(basicSecondTeamComposition),
        comments: t.Array(basicComment),
    })
]);
export type ExtendedMatch = typeof extendedMatch.static;
