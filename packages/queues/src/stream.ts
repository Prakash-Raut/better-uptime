import { redisClient } from "./redis";

const STREAM_NAME = "betteruptime:monitor";

const xAdd = async ({ url, id }: { url: string; id: string }) => {
	const result = await redisClient.xadd(STREAM_NAME, "*", url, id);
	console.log(`xAdd ${url} ${id} ${result}`);
};

export const xAddBulk = async (items: { monitorId: string; url: string }[]) => {
	for (const item of items) {
		await xAdd({ url: item.url, id: item.monitorId });
	}
};

// Arguments: 'GROUP', groupName, consumerName, 'COUNT', count, 'BLOCK', timeout, 'STREAMS', streamName, ID
// '>' means consume only new messages never delivered to this consumer group.
export const xReadGroup = async (groupName: string, consumerName: string) => {
	const res = await redisClient.xreadgroup(
		"GROUP",
		groupName,
		consumerName,
		"COUNT",
		5,
		"BLOCK",
		0,
		"STREAMS",
		STREAM_NAME,
		">",
	);

	console.log(`xReadGroup ${groupName} ${consumerName} ${res}`);
	return res;
};

// XACK stream_name group_name message_id
const xAck = async (groupName: string, messageId: string) => {
	const res = await redisClient.xack(STREAM_NAME, groupName, messageId);
	console.log("xAck", res);
	return res;
};

export const xAckBulk = async (groupName: string, messageIds: string[]) => {
	messageIds.forEach(async (messageId) => {
		await xAck(groupName, messageId);
	});
};
