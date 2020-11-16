import { Table, Task, Teacher, User, Image, Badge, BadgeCompletion, TaskCompletion } from "@prisma/client";

export const API_ENDPOINT = "http://localhost:3000/api";

export type GetSingleTableResponse = Table & {
    tasks: (Task & {
        TaskCompletion: TaskCompletion[];
    })[];
    badges: (Badge & {
        image: Image;
        BadgeCompletion: BadgeCompletion[];
    })[];
    icon: Image;
    teacher: Teacher & {
        user: User;
    };
};

export default async function getSingleTable(id: number): Promise<GetSingleTableResponse> {
	const resp = await fetch(`${API_ENDPOINT}/tables/getOne`, {
        method: "POST",
        body: JSON.stringify({ id })
    });

    const json = await resp.json();

    if(json.error){
        throw new Error(json.message);
    } else {
        return json.data.table;
    }
}