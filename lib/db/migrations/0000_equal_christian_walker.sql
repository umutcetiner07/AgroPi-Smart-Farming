CREATE TABLE "farming_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"soil_moisture" integer,
	"temperature" integer,
	"humidity" integer,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"pi_uid" text NOT NULL,
	"amount" integer NOT NULL,
	"status" text NOT NULL,
	"transaction_id" text,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"pi_uid" text NOT NULL,
	"username" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_pi_uid_unique" UNIQUE("pi_uid")
);
--> statement-breakpoint
ALTER TABLE "farming_data" ADD CONSTRAINT "farming_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;