import { Pool } from "pg";
import dataBaseInit from "../database/db_init.js";
import "dotenv/config";

export const pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

const databaseConnection = async () =>{
    try{
        await pool.query("SELECT 1");
        console.log("Database Connected.");
    }catch(err){
        console.log(`Error: ${err}`);
        await dataBaseInit();
    }
};

export default databaseConnection