import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
})

export const timelineProgress = pgTable('timeline_progress', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    timelineId: text('timeline_id').notNull(),
    status: text('status').notNull().$type<'locked' | 'active' | 'completed'>(),
    completedAt: timestamp('completed_at'),
    fragmentRecovered: boolean('fragment_recovered').default(false),
})

export const puzzleEvents = pgTable('puzzle_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    timelineId: text('timeline_id').notNull(),
    puzzleId: text('puzzle_id').notNull(),
    answerHash: text('answer_hash').notNull(),
    outcome: text('outcome').notNull().$type<'correct' | 'wrong'>(),
    timestamp: timestamp('timestamp').defaultNow(),
})

export const fragments = pgTable('fragments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    timelineId: text('timeline_id').notNull(),
    recoveredAt: timestamp('recovered_at').defaultNow(),
    evidenceLogUnlocked: boolean('evidence_log_unlocked').default(true),
})

export const leaderboard = pgTable('leaderboard', {
    userId: uuid('user_id').references(() => users.id).primaryKey(),
    fragmentCount: integer('fragment_count').default(0),
    completionTimestamp: timestamp('completion_timestamp'),
    hintCount: integer('hint_count').default(0),
})

export const emailTransmissions = pgTable('email_transmissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    sector: text('sector').notNull(),
    stageId: integer('stage_id').notNull(),
    answer: text('answer').notNull(),
    recoveryKey: text('recovery_key').notNull().unique(),
    isVerified: boolean('is_verified').default(false),
    sentAt: timestamp('sent_at').defaultNow(),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    resendCount: integer('resend_count').default(0),
    lastResentAt: timestamp('last_resent_at'),
    deliveryStatus: text('delivery_status').default('pending'),
    deliveryError: text('delivery_error'),
})