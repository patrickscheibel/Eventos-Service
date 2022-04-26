const { Pool } = require('pg');
const conn = new Pool ({
  host: 'localhost',
  port: '1000',
  user: 'postgres',
  password: 'postgres',
  database: 'event_pg',
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

conn.connect();

(async () => {
  await createTable();
})();

async function createTable() {
  await conn.query(`
    create table if not exists event (
      id SERIAL,
      category varchar not null,
      name varchar not null,
      description text,
      starts_at TIMESTAMP not null,
      ends_at TIMESTAMP not null,
      primary key (id)
    )
  `);
  console.log('Table event created');
}

exports.create = async function (req, res) {

  let category = req.body.category;
  let name = req.body.name;
  let description = req.body.description;
  let starts_at = req.body.starts_at;
  let ends_at = req.body.ends_at;

  if(category != null && name != null && description != null && starts_at != null && ends_at != null) {
    await conn.query(`insert into event (category, name, description, starts_at, ends_at) values ('` + category + `','` + name + `','` + description + `','` + formatDate(new Date(starts_at)) + `','` + formatDate(new Date(ends_at)) + `') returning *`, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json({"message": "Sucesso"})
    }); 
  } else {
      return res.status(400).json({"message": "Dados invalidos"});
  }
}

exports.edit = async function (req, res) {

  let id = req.body.id;
  let category = req.body.category;
  let name = req.body.name;
  let description = req.body.description;
  let starts_at = req.body.starts_at;
  let ends_at = req.body.ends_at;

  if(category != null && name != null && description != null && starts_at != null && ends_at != null) {
    await conn.query(`update event set category = '` + category + `', name = '` + name + `',description = '` + description + `',starts_at = '` + formatDate(new Date(starts_at)) + `',ends_at = '` + formatDate(new Date(ends_at)) + `' where id = ` + id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json({"message": "Sucesso"})
    }); 
  } else {
      return res.status(400).json({"message": "Dados invalidos"});
  }
}

exports.list = async function (req, res) {
  await conn.query(`select * from event`, function (err, result) {
    if (err) {
        console.log(err);
        return res.status(400).send(err);
    }
    return res.status(200).json(result.rows)
  }); 
}

exports.checkinEvent = async function (req, res) {
  let event_id = req.body.event_id;

  if(event_id != null) {
    await conn.query(`select * from event where id = ` + event_id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows)
    }); 
  }
}

formatDate = function (date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
}