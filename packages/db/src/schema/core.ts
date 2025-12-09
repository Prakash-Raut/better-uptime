import { relations, sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const region = pgTable(
	"region",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		code: varchar("code", { length: 10 }).notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("region_code_idx").on(table.code)],
);

export const monitor = pgTable(
	"monitor",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		url: varchar("url", { length: 2048 }).notNull(),
		frequency: integer("frequency").notNull().default(60), // in seconds
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("monitor_user_id_idx").on(table.userId),
		index("monitor_url_idx").on(table.url),
		check("monitor_frequency_check", sql`${table.frequency} > 0`),
	],
);

export const monitorRelations = relations(monitor, ({ one }) => ({
	user: one(user, {
		fields: [monitor.userId],
		references: [user.id],
	}),
}));

export const tickStatusEnum = pgEnum("tick_status", ["up", "down", "unknown"]);

export const tick = pgTable(
	"tick",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		status: tickStatusEnum("status").notNull().default("unknown"),
		responseTime: integer("response_time").notNull().default(0),
		errorMessage: text("error_message"),
		monitorId: uuid("monitor_id")
			.notNull()
			.references(() => monitor.id, { onDelete: "cascade" }),
		regionId: uuid("region_id")
			.notNull()
			.references(() => region.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("tick_monitor_created_at_idx").on(table.monitorId, table.createdAt),
		index("tick_monitor_idx").on(table.monitorId),
		index("tick_region_idx").on(table.regionId),
	],
);

export const tickRelations = relations(tick, ({ one }) => ({
	monitor: one(monitor, {
		fields: [tick.monitorId],
		references: [monitor.id],
	}),
	region: one(region, {
		fields: [tick.regionId],
		references: [region.id],
	}),
}));

export type Region = typeof region.$inferSelect;
export type Monitor = typeof monitor.$inferSelect;
export type Tick = typeof tick.$inferSelect;
