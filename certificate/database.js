const { Pool } = require('pg');
const conn = new Pool ({
  host: 'localhost',
  port: '3000',
  user: 'postgres',
  password: 'postgres',
  database: 'certificate_pg',
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

conn.connect();

(async () => {
  await createTable();
})();

async function createTable() {
  await conn.query(`
    create table if not exists certificate (
      id SERIAL,
      subscription_id integer not null,
      path varchar not null,
      primary key (id)
    )
  `);
  console.log('Table certificate created');
}

exports.create = async function (req, res) {

  let subs = req.body.sub;
  let path = req.body.path;

  await conn.query(`insert into certificate (subscription_id, path) values (` + subs + `,'` + path + `') returning *`, function (err, result) {
    if (err) {
        console.log(err);
        return res.status(400).send(err);
    }
    return res.status(200).json({"path": path})
  }); 
}

exports.show = async function (req, res) {
  await conn.query(`select * from certificate`, function (err, result) {
    if (err) {
        console.log(err);
        return res.status(400).send(err);
    }
    return res.status(200).json(result.rows)
  }); 
}

exports.validation = async function (req, res){
  let subscription_id = req.body.subscription_id;

  if(subscription_id == null) {
    return res.status(400).send("Id invalido");
  } else {
    await conn.query(`select * from certificate where subscription_id = ` + subscription_id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows);
    }); 
  }
}