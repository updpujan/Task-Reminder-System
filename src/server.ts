import app from "./app.js";
import databaseConnection from "./config/databaseConnection.js";
import { tableExists } from "./database/db_table_init.js";
import "dotenv/config";

const PORT = process.env.PORT

try{
    await databaseConnection();
    await tableExists();
    app.listen(PORT,()=>{
        console.log(`Server Running on Port: ${PORT}`);
    });

}catch(e){
    console.log(`Error in Server Starting:\n${e}`);
    process.exit(1);
}
