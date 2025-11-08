import mysql from 'mysql2/promise';
import pkg from 'pg';
const { Client } = pkg;
import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';

// Validate database connection
export const validateDatabaseConnection = async (dbConfig) => {
    try {
        const { dbType, host, port, username, password, databaseName } = dbConfig;

        if (dbType === 'mysql') {
            const connection = await mysql.createConnection({
                host,
                port,
                user: username,
                password,
                database: databaseName
            });
            await connection.end();
            return true;
        } else if (dbType === 'postgresql') {
            const client = new Client({
                host,
                port,
                user: username,
                password,
                database: databaseName
            });
            await client.connect();
            await client.end();
            return true;
        } else if (dbType === 'mongodb') {
            const uri = `mongodb://${username}:${password}@${host}:${port}/${databaseName}`;
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            await mongoose.disconnect();
            return true;
        }

        return false;
    } catch (error) {
        console.error('Database validation error:', error);
        return false;
    }
};

// Extract data from database
export const extractDataFromDB = async (dbConfig) => {
    try {
        const { dbType, host, port, username, password, databaseName } = dbConfig;
        let data = [];
        let columns = [];

        if (dbType === 'mysql') {
            const connection = await mysql.createConnection({
                host,
                port,
                user: username,
                password,
                database: databaseName
            });

            // Get first table
            const [tables] = await connection.query('SHOW TABLES');
            if (tables.length === 0) throw new Error('No tables found');

            const tableName = Object.values(tables[0])[0];
            
            // Get data
            const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 1000`);
            data = rows;
            columns = rows.length > 0 ? Object.keys(rows[0]) : [];

            await connection.end();
        } else if (dbType === 'postgresql') {
            const client = new Client({
                host,
                port,
                user: username,
                password,
                database: databaseName
            });
            await client.connect();

            // Get first table
            const tablesResult = await client.query(
                "SELECT table_name FROM information_schema.tables WHERE table_schema='public' LIMIT 1"
            );
            if (tablesResult.rows.length === 0) throw new Error('No tables found');

            const tableName = tablesResult.rows[0].table_name;
            
            // Get data
            const result = await client.query(`SELECT * FROM ${tableName} LIMIT 1000`);
            data = result.rows;
            columns = result.fields.map(f => f.name);

            await client.end();
        }

        return {
            rowCount: data.length,
            columnCount: columns.length,
            columns,
            sampleData: data.slice(0, 100),
            allData: data
        };
    } catch (error) {
        console.error('Data extraction error:', error);
        throw error;
    }
};

// Extract data from file
export const extractDataFromFile = async (fileConfig) => {
    return new Promise((resolve, reject) => {
        const { filePath, fileType } = fileConfig;
        let data = [];
        let columns = [];

        try {
            if (fileType === 'csv') {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        if (columns.length === 0) {
                            columns = Object.keys(row);
                        }
                        data.push(row);
                    })
                    .on('end', () => {
                        resolve({
                            rowCount: data.length,
                            columnCount: columns.length,
                            columns,
                            sampleData: data.slice(0, 100),
                            allData: data
                        });
                    })
                    .on('error', reject);
            } else if (fileType === 'xlsx') {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                data = xlsx.utils.sheet_to_json(sheet);
                columns = data.length > 0 ? Object.keys(data[0]) : [];

                resolve({
                    rowCount: data.length,
                    columnCount: columns.length,
                    columns,
                    sampleData: data.slice(0, 100),
                    allData: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Process file upload
export const processFileUpload = async (file) => {
    // Validation and processing logic
    return {
        success: true,
        fileName: file.originalname,
        filePath: file.path
    };
};
