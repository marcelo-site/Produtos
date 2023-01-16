import mysql from 'mysql'

export const pool =
mysql.createPool({
        connectionLimit: 20,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'produtos'
    })