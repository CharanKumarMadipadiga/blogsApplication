import { reject } from "bcrypt/promises.js";
import { db } from "../db/dbConnection.js";

export const runQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

export const queryAll = (query) => {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};

export const querySingle = (query, params) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if(err) {
                reject(err)
            }
            else {
                resolve(row)
            }
        });
    });
};

export const deleteQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if(err) {
                reject(err)
            }
            else {
                resolve(this)
            }
        })
    })
}