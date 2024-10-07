import { NotFoundError } from "elysia";
import { ExtendedTeamMember, ExtendedTeamMemberAttachment, ExtendedTeamMemberHighlight, ExtendedTeamMemberStatistics } from "../models/teamMember/extended";
import prisma from "../utils/prisma";
import { InsertTeamMember, InsertTeamMemberHighlight, UpdateTeamMember, UpdateTeamMemberHighlight, UpdateTeamMemberStatistics } from "../models/teamMember/utils";
import { UserService } from "./user";
import { OperationError } from "../utils/errors";
import { uploadExists } from "../utils/uploads";

export abstract class TeamMemberService {
    static async get(id: number): Promise<ExtendedTeamMember> {
        const teamMember = await prisma.teamMember.findUnique({
            where: {
                id
            },
            include: {
                attachments: true,
                statistics: true
            }
        });

        if (!teamMember) throw new NotFoundError("Team member not found");

        teamMember["avatar"] = await uploadExists("teamMemberAvatars", `${teamMember.id}`)
            ? `/api/team/members/avatars/${teamMember.id}`
            : null;

        return teamMember;
    }

    static async getAll(): Promise<ExtendedTeamMember[]> {
        const teamMembers = await prisma.teamMember.findMany({
            include: {
                attachments: true,
                statistics: true
            }
        });

        for (const teamMember of teamMembers) {
            teamMember["avatar"] = await uploadExists("teamMemberAvatars", `${teamMember.id}`)
                ? `/api/team/members/avatars/${teamMember.id}`
                : null;
        }

        return teamMembers;
    }

    static async create(member: InsertTeamMember, userId: number): Promise<ExtendedTeamMember> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can create team members", 403);

        const newMember = await prisma.teamMember.create({
            data: member
        });
        await prisma.teamMemberStatistics.create({
            data: { teamMemberId: newMember.id }
        });

        return await this.get(newMember.id);
    }

    static async update(id: number, member: UpdateTeamMember, userId: number): Promise<ExtendedTeamMember> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can update team members", 403);

        const updatedMember = await prisma.teamMember.update({
            where: { id },
            data: member
        });

        return await this.get(updatedMember.id);
    }

    static async delete(id: number, userId: number): Promise<void> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can delete team members", 403);

        await prisma.teamMember.delete({ where: { id } });
    }

    static async getStatistics(id: number): Promise<ExtendedTeamMemberStatistics> {
        const statistics = await prisma.teamMemberStatistics.findUnique({
            where: { teamMemberId: id },
            include: { teamMember: true },
        });

        if (!statistics) throw new NotFoundError("Team member not found");
        return statistics;
    }

    static async updateStatistics(id: number, statistics: UpdateTeamMemberStatistics, userId: number): Promise<ExtendedTeamMemberStatistics> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can update team member statistics", 403);

        const updatedStatistics = await prisma.teamMemberStatistics.update({
            where: { teamMemberId: id },
            data: statistics,
            include: { teamMember: true },
        });

        return updatedStatistics;
    }

    static async getAttachment(id: number): Promise<ExtendedTeamMemberAttachment> {
        const attachment = await prisma.teamMemberAttachment.findUnique({
            where: { id },
            include: { teamMember: true }
        });

        if (!attachment) throw new NotFoundError("Attachment not found");
        return attachment;
    }

    static async createAttachment(teamMemberId: number, filename: string, userId: number): Promise<ExtendedTeamMemberAttachment> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can create attachments", 403);

        const teamMember = await this.get(teamMemberId);

        const attachment = await prisma.teamMemberAttachment.create({
            data: {
                teamMemberId: teamMember.id,
                filename
            },
            include: { teamMember: true }
        });

        return attachment;
    }

    static async deleteAttachment(id: number, userId: number): Promise<void> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can delete attachments", 403);

        await prisma.teamMemberAttachment.delete({ where: { id } });
    }

    static async getHighlight(id: number): Promise<ExtendedTeamMemberHighlight> {
        const highlight = await prisma.teamMemberHighlight.findUnique({
            where: { id },
            include: { teamMember: true }
        });

        if (!highlight) throw new NotFoundError("Highlight not found");
        return highlight;
    }

    static async createHighlight(highlight: InsertTeamMemberHighlight, userId: number): Promise<ExtendedTeamMemberHighlight> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can create highlights", 403);

        const teamMember = await this.get(highlight.teamMemberId);

        const newHighlight = await prisma.teamMemberHighlight.create({
            data: {
                ...highlight,
                teamMemberId: teamMember.id
            },
            include: { teamMember: true }
        });

        return newHighlight;
    }

    static async updateHighlight(id: number, highlight: UpdateTeamMemberHighlight, userId: number): Promise<ExtendedTeamMemberHighlight> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can update highlights", 403);

        const updatedHighlight = await prisma.teamMemberHighlight.update({
            where: { id },
            data: highlight,
            include: { teamMember: true }
        });

        return updatedHighlight;
    }

    static async deleteHighlight(id: number, userId: number): Promise<void> {
        const user = await UserService.getSlim(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can delete highlights", 403);

        await this.getHighlight(id);

        await prisma.teamMemberHighlight.delete({ where: { id } });
    }
}
