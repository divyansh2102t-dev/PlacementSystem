import dns from "node:dns";
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

// DNS Hook for reliable resolution
const resolver = new dns.promises.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);
const originalLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  resolver
    .resolve4(hostname)
    .then((addresses) => {
      if (options && options.all) {
        callback(null, addresses.map((a) => ({ address: a, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    })
    .catch(() => originalLookup(hostname, options, callback));
};

async function optimizeDb() {
  if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
    const envContent = fs.readFileSync(".env", "utf8");
    const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) process.env.DATABASE_URL = match[1];
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("No DATABASE_URL found.");
    return;
  }

  const sql = neon(databaseUrl);
  console.log("Optimizing Neon database indices...");

  const queries = [
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
    `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`,
    `CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);`,
    `CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);`,
    `CREATE INDEX IF NOT EXISTS idx_companies_tier ON companies(tier);`,
    `CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_drive_id ON applications(drive_id);`,
    `CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications(stage);`,
    `ANALYZE users;`,
    `ANALYZE students;`,
    `ANALYZE companies;`,
    `ANALYZE applications;`,
  ];

  for (const q of queries) {
    try {
      await sql.query(q);
      console.log("Executed:", q.split("(")[0]);
    } catch (err) {
      console.warn("Index warning for:", q, err.message);
    }
  }

  console.log("Neon database successfully optimized for high-speed retrieval!");
}

optimizeDb();

