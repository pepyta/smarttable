import { Invitations, PrismaClient, Table, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export type GetInvitationsResponseBody = {
    error: boolean;
    data: {
        invitations: (Invitations & {
            table: Table & {
                teacher: User;
            };
        })[];
    }
};

export default async function invite(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        const user = await prisma.user.findOne({
            where: {
                email: session.user.email
            }
        });

        const invitations = await prisma.invitations.findMany({
            where: {
                student: {
                    id: user.id
                }
            },
            include: {
                table: {
                    include: {
                        teacher: true
                    }
                }
            }
        });

        res.json({
            error: false,
            data: {
                invitations
            }
        });
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }

}