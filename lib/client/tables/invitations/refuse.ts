import { API_ENDPOINT } from "../../invitations/get";

export default async function refuseInvitations(id: number): Promise<string> {
	const resp = await fetch(`${API_ENDPOINT}/tables/invitations/delete`, {
        method: "POST",
        body: JSON.stringify({
            id
        })
    });
    const json = await resp.json();

    if(json.error) throw new Error(json.message);

    return json.message;
}