import { API_ENDPOINT } from "../../invitations/get";

export default async function setCompletion(id: number, userid: number, completed: boolean) {
	const resp = await fetch(`${API_ENDPOINT}/tables/badges/${completed ? "setCompletion" : "removeCompletion"}`, {
        method: "POST",
        body: JSON.stringify({
            id,
            completed,
            userid
        })
    });
    const json = await resp.json();

    if(json.error) throw new Error(json.message);
}