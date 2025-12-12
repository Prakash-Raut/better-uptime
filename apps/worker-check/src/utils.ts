export const pingFromRegion = async (url: string) => {
	console.log("Pinging URL", url);
	const response = await fetch(url);

	if (response.status >= 400) {
		return "down";
	}

	return "up";
};
