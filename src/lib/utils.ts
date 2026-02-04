export async function twitchLoginExists(login: string) {
	const res = await fetch("https://gql.twitch.tv/gql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
		},
		body: JSON.stringify({
			query: `
					query User($login: String!) {
						user(login: $login) {
							id
						}
					}
				`,
			variables: { login },
		}),
	});

	const user = (await res.json()).data.user;

	return user.id != "";
}
