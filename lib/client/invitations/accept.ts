import { API_ENDPOINT } from "./get";

export default async function acceptInvitation(id: number): Promise<{ error: boolean, message: string }> {
	const resp = await fetch(`${API_ENDPOINT}/tables/invitations/accept`, {
        method: "POST",
        body: JSON.stringify({ id })
    });

    const json = await resp.json();

    if(json.error) throw new Error(json.message);

	return json;
}