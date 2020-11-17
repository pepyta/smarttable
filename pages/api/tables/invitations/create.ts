import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { getRole } from "../../role/get";

const prisma = new PrismaClient();

export default async function invite(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, email }: { id: number, email: string } = JSON.parse(req.body);

        const session = await getSession({ req });
        const role = await getRole(session);

        if(role !== "TEACHER") throw new Error("Only allowed for TEACHERS!");

        const table = await prisma.table.findOne({
            where: {
                id
            }
        });

        const user = await prisma.user.findOne({
            where: {
                email: session.user.email
            }
        });

        if(table.teacherId !== user.id) throw new Error("Not your table!");

        const student = await prisma.user.findOne({
            where: {
                email
            }
        });

        if(student === null) throw new Error("Nem találtuk ezzel az email címmel tanulót.");

        await prisma.invitations.create({
            data: {
                student: {
                    connect: {
                        id: student.id
                    }
                },
                table: {
                    connect: {
                        id: table.id
                    }
                }
            }
        });

        res.json({
            error: false,
            message: `Sikeresn meghívtad ${student.name}-et, hogy csatlakozzon!`
        });
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }

}