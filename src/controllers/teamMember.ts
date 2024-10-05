import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { errorResponseType, successResponse, successResponseType, unauthorizedResponseType } from "../utils/responses";
import { extendedTeamMember, extendedTeamMemberAttachment, extendedTeamMemberStatistics } from "../models/teamMember/extended";
import { TeamMemberService } from "../services/teamMember";
import { insertTeamMember, insertTeamMemberAttachment, updateTeamMember, updateTeamMemberStatistics } from "../models/teamMember/utils";
import { deleteUpload, getUpload, saveUpload } from "../utils/uploads";
import { UserService } from "../services/user";
import { OperationError } from "../utils/errors";

const teamMemberController = new Elysia({ prefix: "/team/members" })
    .use(authMiddleware)
    .get("", async ({ set }) => {
        const teamMembers = await TeamMemberService.getAll();

        return successResponse(set, teamMembers);
    }, {
        response: {
            200: successResponseType(t.Array(extendedTeamMember))
        },
        detail: {
            summary: "Get all",
            description: "Get all team members",
            tags: ["Team Members"]
        }
    })
    .get("/:id", async ({ set, params }) => {
        const teamMember = await TeamMemberService.get(params.id);

        return successResponse(set, teamMember);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            200: successResponseType(extendedTeamMember),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Get by id",
            description: "Get a team member by id",
            tags: ["Team Members"]
        }
    })
    .post("", async ({ set, body, auth }) => {
        const userId = await auth.id();
        const teamMember = await TeamMemberService.create(body, userId);

        return successResponse(set, teamMember);
    }, {
        body: insertTeamMember,
        response: {
            201: successResponseType(extendedTeamMember),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can create team members"),
        },
        detail: {
            summary: "Create",
            description: "Create a team member",
            tags: ["Team Members"]
        }
    })
    .patch("/:id", async ({ set, body, params, auth }) => {
        const userId = await auth.id();
        const teamMember = await TeamMemberService.update(params.id, body, userId);

        return successResponse(set, teamMember);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        body: updateTeamMember,
        response: {
            200: successResponseType(extendedTeamMember),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can update team members"),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Update",
            description: "Update a team member",
            tags: ["Team Members"]
        }
    })
    .delete("/:id", async ({ set, params, auth }) => {
        const userId = await auth.id();
        await TeamMemberService.delete(params.id, userId);

        return successResponse(set, null);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can delete team members"),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Delete",
            description: "Delete a team member",
            tags: ["Team Members"]
        }
    })
    .get("/:id/statistics", async ({ set, params }) => {
        const teamMemberStatistics = await TeamMemberService.getStatistics(params.id);

        return successResponse(set, teamMemberStatistics);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            200: successResponseType(extendedTeamMemberStatistics),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Get statistics",
            description: "Get a team member's statistics",
            tags: ["Team Members"]
        }
    })
    .patch("/:id/statistics", async ({ set, body, params, auth }) => {
        const userId = await auth.id();
        const teamMemberStatistics = await TeamMemberService.updateStatistics(params.id, body, userId);

        return successResponse(set, teamMemberStatistics);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        body: updateTeamMemberStatistics,
        response: {
            200: successResponseType(extendedTeamMemberStatistics),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can update team member statistics"),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Update statistics",
            description: "Update a team member's statistics",
            tags: ["Team Members"]
        }
    })
    .get("/attachments/:id", async ({ params }) => {
        const attachment = await TeamMemberService.getAttachment(params.id);
        return await getUpload("teamMemberAttachments", attachment.filename);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            404: errorResponseType(404, "Attachment not found")
        },
        detail: {
            summary: "Get attachment",
            description: "Get a team member's attachment",
            tags: ["Team Members"]
        }
    })
    .post("/attachments", async ({ set, body, auth }) => {
        const userId = await auth.id();
        const user = await UserService.get(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can upload attachments", 403);

        const fileName = Date.now() + "-" + body.file.name;
        await saveUpload("teamMemberAttachments", fileName, body.file);
        const attachment = await TeamMemberService.createAttachment(body.teamMemberId, fileName, userId);

        return successResponse(set, attachment, 201);
    }, {
        body: insertTeamMemberAttachment,
        response: {
            201: successResponseType(extendedTeamMemberAttachment),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can upload attachments"),
            404: errorResponseType(404, "Team member not found")
        },
        detail: {
            summary: "Upload attachment",
            description: "Upload a team member's attachment",
            tags: ["Team Members"]
        }
    })
    .delete("/attachment/:id", async ({ set, params, auth }) => {
        const userId = await auth.id();
        const user = await UserService.get(userId);
        if (!user.isAdmin) throw new OperationError("Only admins can delete attachments", 403);

        const attachment = await TeamMemberService.getAttachment(params.id);
        if (!attachment) throw new OperationError("Attachment not found", 404);

        await deleteUpload("teamMemberAttachments", attachment.filename);
        await TeamMemberService.deleteAttachment(params.id, userId);

        return successResponse(set, null);
    }, {
        params: t.Object({
            id: t.Number()
        }),
        response: {
            204: successResponseType(t.Null()),
            401: unauthorizedResponseType,
            403: errorResponseType(403, "Only admins can delete attachments"),
            404: errorResponseType(404, "Attachment not found")
        },
        detail: {
            summary: "Delete attachment",
            description: "Delete a team member's attachment",
            tags: ["Team Members"]
        }
    });

export default teamMemberController;
