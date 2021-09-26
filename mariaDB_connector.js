const mariaDB = require('mariadb');

const config = {
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'taller3',
    connectionLimit: 5,
    acquireTimeout: 300
}

class Connection{
    mariaDB_connector = mariaDB.createPool(config);

    async query(param){
        var conn = await this.mariaDB_connector.getConnection();
        var ret = null;
        conn.query(param)
            .then(data => {
                ret = data;
                console.log(ret)
                conn.end()
            })
            .catch(e => {
                console.log(e)
                conn.end()
            })
        return ret;
    }
}

module.exports = new Connection();
