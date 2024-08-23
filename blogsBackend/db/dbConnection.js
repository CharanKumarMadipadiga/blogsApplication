import sqlite3 from 'sqlite3'
import 'dotenv/config'

const sqlite = sqlite3.verbose()
const dbPath= process.env.dbPATH

export let db

export const dbConnection =() => {

    db = new sqlite.Database(dbPath, (err) => {
        if(err) {
            console.log(`DB Error ${err.message}`)
            process.exit(1)
        }
    
        console.log("Connected to the database")
    });

    // console.log("db", db)

    return db
}


export const closeConnection = () => {
    if(db) {
        db.close((err) => {
            if (err) {
                console.log(`Error closing the database connection: ${err.message}`);
            } else {
                console.log("Database connection closed.");
            }
        });
    }
}