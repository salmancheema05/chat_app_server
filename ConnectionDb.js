import pkg from 'pg'
const {Pool} = pkg
const pool = new Pool({
    user: 'postgres',
    host:'localhost',
    database: "chatappdb",
    password: 123456,
    port:  5433,
});
const connectdb = () =>{
    pool.connect().then(()=>{
        console.log("database is connect")
    }).catch((error) => console.log("database is not  connect "+error))
}

export { connectdb, pool}