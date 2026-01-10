import dotenv from "dotenv";

dotenv.config();

interface Config {
  secret: string;
  skey_default: string;
  ttl: number;
}

const config: Config = {
  secret:
    process.env.SECRET ||
    (() => {
      throw new Error("SECRET not initialized");
    })(),
  skey_default:
    process.env.SKEY_DEFAULT ||
    "2b8b04a6e56f92a4c0626ad3e0cd4245b6ed06ac46a8366fc0a291b75d1b51ff",
  ttl: Number(process.env.TTL) || 1,
};

export default config;
