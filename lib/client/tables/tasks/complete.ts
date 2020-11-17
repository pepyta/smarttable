import { Table, Task, User, Image, Badge } from "@prisma/client";
import { API_ENDPOINT } from "../../invitations/get";

export default async function setCompletion(id: number, completed: boolean) {
	const resp = await fetch(`${API_ENDPOINT}/tables/tasks/setCompletion`, {
        method: "POST",
        body: JSON.stringify({
            id,
            completed
        })
    });
    const json = await resp.json();

    if(json.error) throw new Error(json.message);
}