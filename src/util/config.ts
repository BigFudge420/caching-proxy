import dotenv from "dotenv";

dotenv.config();

interface Config {
  secret: string;
}

const config: Config = {
  secret:
    process.env.SECRET ||
    (() => {
      throw new Error("SECRET not initialized");
    })(),
};

export default config;
