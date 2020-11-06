import { SetRoleResponse } from "../../../pages/api/role/set";
import { API_ENDPOINT } from "./get";

export default async function setRole(role: "TEACHER" | "STUDENT"): Promise<SetRoleResponse> {
	const resp = await fetch(`${API_ENDPOINT}/role/set`, {
		method: "POST",
		body: JSON.stringify({
			role
		})
	});

	return await (resp.json());
}