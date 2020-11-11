import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { BadgeRow, TaskRow } from "../../tables/create";
import { AvailableRoles, getRole } from "../role/get";
import formidable from "formidable";
import sizeOf from "buffer-image-size";
import fs from "fs";

export type CreateTableApiRequestBody = {
    name: string;
    badges: BadgeRow[];
    tasks: TaskRow[];
};

const tableIncludes = {
    include: {
        tasks: true,
        badges: {
            include: {
                image: true
            }
        },
        icon: true,
        teacher: {
            include: {
                user: true
            }
        }
    }
}

const prisma = new PrismaClient();

export default async function getTables(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        if (!session) throw new Error("No active login found!");

        const role = await getRole(session);
        const user = await prisma.user.findOne({
            where: {
                email: session.user.email
            }
        });

        if(role === "TEACHER"){
            const tables = await prisma.table.findMany({
                where: {
                    teacherId: user.id,
                },
                ...tableIncludes
            });

            res.json({
                error: false,
                data: {
                    tables
                }
            });
        } else if(role === "STUDENT"){
            const connections = await prisma.student.findMany({
                where: {
                    userid: user.id
                },
                include: {
                    Table: tableIncludes
                }
            });

            const tables = connections.map((conn) => conn.Table);

            res.json({
                error: false,
                data: {
                    tables
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