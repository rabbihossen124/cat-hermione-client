import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb://cat-hermione:mCQVML3UpX7iJkiA@ac-ytk8sva-shard-00-00.nhpmu09.mongodb.net:27017,ac-ytk8sva-shard-00-01.nhpmu09.mongodb.net:27017,ac-ytk8sva-shard-00-02.nhpmu09.mongodb.net:27017/?ssl=true&replicaSet=atlas-vfymp7-shard-0&authSource=admin";

// Global cached client for Next.js hot reload safety
declare global {
  var _mongoAuthClient: MongoClient | undefined;
}

let client: MongoClient;
if (process.env.NODE_ENV === "development") {
  if (!global._mongoAuthClient) {
    global._mongoAuthClient = new MongoClient(uri);
  }
  client = global._mongoAuthClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db("unityaid");

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const hasGoogleCreds = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      enabled: hasGoogleCreds,
    },
  },
  plugins: [jwt()],
  user: {
    additionalFields: {
      photoURL: {
        type: "string",
        required: false,
      },
    },
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "unityaid_98f7e6d5c4b3a210_better_auth_jwt_secret_token_bangladesh_2026",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
});
