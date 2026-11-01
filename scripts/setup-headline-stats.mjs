import dns from "node:dns";
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

// Read DATABASE_URL from .env manually
const envContent = fs.readFileSync(".env", "utf8");
let dbUrl = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("DATABASE_URL=")) {
    dbUrl = line.substring("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "");
    break;
  }
}

const resolver = new dns.promises.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);
const orig = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  resolver.resolve4(hostname)
    .then(addrs => {
      if (options && options.all) callback(null, addrs.map(a => ({ address: a, family: 4 })));
      else callback(null, addrs[0], 4);
    })
    .catch(() => orig(hostname, options, callback));
};

async function run() {
  const sql = neon(dbUrl);
  console.log("Creating site_settings table...");
  await sql.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(64) PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const initialHeadlineStats = {
    highestPackage: {
      value: "₹45.0 LPA",
      label: "HIGHEST PACKAGE",
      subtext: "Super Dream Tier",
    },
    averageCtc: {
      value: "₹14.2 LPA",
      label: "AVERAGE CTC",
      subtext: "All Engineering Branches",
    },
    placementRate: {
      value: "86.4%",
      label: "PLACEMENT RATE",
      subtext: "2026 Graduating Cohort",
    },
    recruitingPartners: {
      value: "120+",
      label: "RECRUITING PARTNERS",
      subtext: "Global Tech & Enterprise",
    },
  };

  await sql.query(`
    INSERT INTO site_settings (key, value)
    VALUES ('headline_stats', '${JSON.stringify(initialHeadlineStats)}')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  `);

  console.log("Successfully seeded headline_stats in Neon PostgreSQL!");
}

run().catch(console.error);
