import { t } from "elysia";
import { basicSecondTeamComposition } from "./basic";
import { basicMatch } from "../match/basic";

export const extendedSecondTeamComposition = t.Composite([
    basicSecondTeamComposition,
    t.Object({
        match: basicMatch,
    })
]);
export type ExtendedSecondTeamComposition = typeof extendedSecondTeamComposition.static;
