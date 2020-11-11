import { Table, Task, Teacher, User, Image, Badge } from "@prisma/client";

export const API_ENDPOINT = "http://localhost:3000/api";

export type GetTablesResponse = (Table & {
    tasks: Task[];
    badges: (Badge & {
        image: Image;
    })[];
    icon: Image;
    teacher: Teacher & {
        user: User;
    };
})[];

export default async function getRole(): Promise<GetTablesResponse> {
	const resp = await fetch(`${API_ENDPOINT}/tables/get`);
    const json = await resp.json();

    if(json.error){
        throw new Error(json.message);
    } else {
        return json.data.tables;
    }
}