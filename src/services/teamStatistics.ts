import { TeamStatistics } from "../models/teamStatistics/basic";
import { UpdateTeamStatistics } from "../models/teamStatistics/utils";
import prisma from "../utils/prisma";

export abstract class TeamStatisticsService {
    static async get(): Promise<TeamStatistics> {
        const teamStatistics = await prisma.teamStatistics.findFirst();
        return teamStatistics || await this.createEmpty();
    }

    static async createEmpty(): Promise<TeamStatistics> {
        const teamStatistics = await prisma.teamStatistics.create({
            data: {
                gamesPlayed: 0,
                wins: 0,
                winsOvertime: 0,
                winsPenalty: 0,
                losses: 0,
                lossesOvertime: 0,
                lossesPenalty: 0,
                goalsScored: 0,
                goalsConceded: 0,
                yellowCards: 0,
                redCards: 0,
                cleanSheets: 0,
            }
        });
        return teamStatistics;
    }

    static async update(data: UpdateTeamStatistics): Promise<TeamStatistics> {
        const teamStatistics = await this.get();
        const updatedTeamStatistics = await prisma.teamStatistics.update({
            where: { id: teamStatistics.id },
            data: data
        });
        return updatedTeamStatistics;
    }
}
