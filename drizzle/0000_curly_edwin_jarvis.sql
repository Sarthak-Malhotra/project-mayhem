CREATE TABLE "email_transmissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"sector" text NOT NULL,
	"stage_id" integer NOT NULL,
	"answer" text NOT NULL,
	"recovery_key" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"sent_at" timestamp DEFAULT now(),
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resend_count" integer DEFAULT 0,
	"last_resent_at" timestamp,
	"delivery_status" text DEFAULT 'pending',
	"delivery_error" text,
	CONSTRAINT "email_transmissions_recovery_key_unique" UNIQUE("recovery_key")
);
--> statement-breakpoint
CREATE TABLE "fragments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"timeline_id" text NOT NULL,
	"recovered_at" timestamp DEFAULT now(),
	"evidence_log_unlocked" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"fragment_count" integer DEFAULT 0,
	"completion_timestamp" timestamp,
	"hint_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "puzzle_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"timeline_id" text NOT NULL,
	"puzzle_id" text NOT NULL,
	"answer_hash" text NOT NULL,
	"outcome" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "timeline_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"timeline_id" text NOT NULL,
	"status" text NOT NULL,
	"completed_at" timestamp,
	"fragment_recovered" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "fragments" ADD CONSTRAINT "fragments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzle_events" ADD CONSTRAINT "puzzle_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline_progress" ADD CONSTRAINT "timeline_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;