import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export type AvailableRoles = "TEACHER" | "STUDENT" | "NOT_CHOOSEN";

export type GetRoleResponse = {
	error: boolean;
	data: {
		role: AvailableRoles;
	};
};

export default async function(req: NextApiRequest, res: NextApiResponse){
	const session = await getSession({ req });
	
	if(!session) throw new Error("No active login");

	const user = await prisma.user.findOne({
		where: {
			email: session.user.email
		}
	});

	const teacher = await prisma.teacher.findOne({
		where: {
			userid: user.id
		}
	});

	if(teacher !== null) {
		res.json({
			error: false,
			data: {
				role: "TEACHER"
			}
		});

		return;
	}

	const student = await prisma.student.findOne({
		where: {
			userid: user.id
		}
	});

	if(student !== null){
		res.json({
			error: false,
			data: {
				role: "STUDENT"
			}
		});

		return;
	}

	res.json({
		error: false,
		data: {
			role: "NOT_CHOOSEN"
		}
	});
}