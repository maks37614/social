import pg from "pg";

/**
 * Social uses its own PostgreSQL database. Never fall back to DATABASE_URL,
 * which may belong to h00k or an unrelated deployment.
 */
export function createSocialPool(): pg.Pool {
  const connectionString = process.env.SOCIAL_DATABASE_URL;
  if (!connectionString) {
    throw new Error("SOCIAL_DATABASE_URL is required; refusing to use another database");
  }
  const url = new URL(connectionString);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("SOCIAL_DATABASE_URL must be a PostgreSQL connection string");
  }
  if (!url.pathname || url.pathname === "/") {
    throw new Error("SOCIAL_DATABASE_URL must name a dedicated database");
  }
  return new pg.Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    statement_timeout: 10000,
    application_name: "social",
  });
}
