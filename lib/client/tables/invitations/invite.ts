import { API_ENDPOINT } from "../../invitations/get";

export default async function invite(tableid: number, email: string): Promise<string> {
	const resp = await fetch(`${API_ENDPOINT}/tables/invitations/create`, {
        method: "POST",
        body: JSON.stringify({
            id: tableid,
            email
        })
    });
    const json = await resp.json();

    if(json.error) throw new Error(json.message);

    return json.message;
}