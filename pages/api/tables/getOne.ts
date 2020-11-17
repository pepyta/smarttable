import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { BadgeRow, TaskRow } from "../../tables/create";
import { getRole } from "../role/get";

export type CreateTableApiRequestBody = {
    name: string;
    badges: BadgeRow[];
    tasks: TaskRow[];
};

const tableIncludes = {
    include: {
        students: {
            include: {
                user: true
            }
        },
        tasks: {
            include: {
                TaskCompletion: {
                    include: {
                        user: true
                    }
                }
            }
        },
        badges: {
            include: {
                image: true,
                BadgeCompletion: {
                    include: {
                        user: true
                    }
                }
            }
        },
        icon: true,
        teacher: true
    }
};

const prisma = new PrismaClient();

export default async function getOneTable(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        if (!session) throw new Error("No active login found!");
        const { id }: { id: number } = JSON.parse(req.body);

        const role = await getRole(session);
        const user = await prisma.user.findOne({
            where: {
                email: session.user.email
            }
        });

        if(role === "TEACHER"){
            const table = await prisma.table.findOne({
                where: {
                    id
                },
                ...tableIncludes
            });

            res.json({
                error: false,
                data: {
                    table
                }
            });
        } else if(role === "STUDENT"){
            const connections = await prisma.student.findFirst({
                where: {
                    tableid: id
                },
                include: {
                    table: tableIncludes
                }
            });

            res.json({
                error: false,
                data: {
                    table: connections.table
                }
            })
        } else throw new Error("Not choosen");
        
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }
}