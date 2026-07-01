const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database...");
  const sql = neon(dbUrl);

  console.log("Creating user_progress table...");
  await sql`
    CREATE TABLE IF NOT EXISTS "user_progress" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" uuid NOT NULL,
      "case_id" text NOT NULL,
      "progress_key" text NOT NULL,
      "progress_value" text NOT NULL,
      "updated_at" timestamp DEFAULT now()
    );
  `;

  console.log("Adding foreign key constraint...");
  try {
    await sql`
      ALTER TABLE "user_progress" 
      DROP CONSTRAINT IF EXISTS "user_progress_user_id_users_id_fk";
    `;
    await sql`
      ALTER TABLE "user_progress" 
      ADD CONSTRAINT "user_progress_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
    `;
  } catch (constraintErr) {
    console.warn("Could not alter foreign key constraint directly (might already exist):", constraintErr.message);
  }

  console.log("Migration successful!");
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
