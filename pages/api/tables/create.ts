import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { BadgeRow, TaskRow } from "../../tables/create";
import { AvailableRoles, getRole } from "../role/get";
import formidable from "formidable";
import sizeOf from "buffer-image-size";
import fs from "fs";

const prisma = new PrismaClient();

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};  

export type CreateTableApiRequestBody = {
    name: string;
    icon: File;
    badges: BadgeRow[];
    tasks: TaskRow[];
};

const images = [];

export default async function createTable(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        const form = new formidable.IncomingForm();
    
        form.uploadDir = "./public/img/uploads";
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            for(let id in files){
                const file = files[id];
                if(id.startsWith("badge")) {
                    const number = parseInt(id.replace("badge-", ""));
                    images[number] = file;
                }
            }

            const data: CreateTableApiRequestBody = JSON.parse(fields["data"]+"");
            if (!session) throw new Error("No active login found!");
            if (await getRole(session) !== "TEACHER") throw new Error("Forbidden");
    
            const user = await prisma.user.findOne({
                where: {
                    email: session.user.email
                }
            });
    
            const icon = files["icon"] ? {
                icon: {
                     create: {
                         width: sizeOf(fs.readFileSync(files["icon"].path)).width,
                         height: sizeOf(fs.readFileSync(files["icon"].path)).height,
                         path: files["icon"].path
                     }
                 }
            } : {};

            const table = await prisma.table.create({
                data: {
                    name: data.name,
                    teacher: {
                        connect: {
                            userid: user.id
                        }
                    },
                    tasks: {
                        create: data.tasks.map((task) => {
                            return {
                                name: task.name,
                                description: task.description,
                                points: task.point,
                                endsAt: task.date
                            };
                        })
                    },
                    badges: {
                        create: data.badges.map((badge, index) => {
                            if(images[index] !== undefined){
                                console.log(images[index]);
                                const dimensions = sizeOf(fs.readFileSync(images[index].path));
                                return {
                                    name: badge.name,
                                    image: {
                                        create: {
                                            width: dimensions.width,
                                            height: dimensions.height,
                                            path: images[index].path
                                        }
                                    }
                                }
                            } else {
                                return {
                                    name: badge.name
                                }
                            }
                        })
                    },
                    ...icon
                }
            })


            res.json({
                error: false,
                message: "Táblázat sikeresn létrehozva!",
                data: {
                    table
                }
            });
        });
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }

}