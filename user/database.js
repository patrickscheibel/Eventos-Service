const { Pool } = require('pg');
const conn = new Pool ({
  host: 'localhost',
  port: '4000',
  user: 'postgres',
  password: 'postgres',
  database: 'user_pg',
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

conn.connect();

(async () => {
  await createTable();
})();

async function createTable() {
  await conn.query(`
    create table if not exists users (
      id SERIAL,
      name varchar not null,
      email varchar,
      password varchar,
      cpf varchar not null,
	    admin boolean,
      primary key (id)
    )
  `);
  console.log('Table users created');
}

exports.simpleCreate = async function insert(req, res) {

  let name = req.body.name;
  let cpf = req.body.cpf;

  if(name != null && cpf != null){
    await conn.query(`insert into users (name, cpf) values ('` + name + `','` + cpf + `') returning *`, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows);
    }); 
  } else {
    return res.status(400).json({"message": "Dados invalidos"});
  }
}

exports.fullCreate = async function insert(req, res) {

  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let cpf = req.body.cpf;

  if(name != null && email != null && password != null && cpf != null) {
    await conn.query(`insert into users (name, email, password, cpf) values ('` + name + `','` + email + `','` + password + `','` + cpf + `') returning *`, function (err, result) {
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

exports.checkinUserCpf = async function show(req, res) {

  let cpf = req.body.cpf;

  if(cpf != null) {
    await conn.query(`select * from users where cpf = '` + cpf + `'`, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows);
    }); 
  } else {
    return res.status(400).json({"message": "CPF invalido"});
  }
}

exports.checkinUser = async function show(req, res) {

  let user_id = req.body.user_id;

  if(user_id != null) {
    await conn.query(`select * from users where id = ` + user_id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows);
    }); 
  } else {
    return res.status(400).json({"message": "Id invalido"});
  }
}

exports.completedCreate = async function (req, res) {

  let email = req.body.email;
  let password = req.body.password;
  let cpf = req.body.cpf;

  if(email != null && password != null) {
    await conn.query(`update users set email = '` + email + `', password = '` + password + `' where cpf = '` + cpf + `'`, function (err, result) {
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

exports.login = async function (req, res){
  let email = req.body.email;
  let password = req.body.password;

  if(email != null && password != null) {
    await conn.query(`select * from users where email = '` + email + `' and  password = '` + password + `'`, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json({"user": result.rows});
    }); 
  } else {
    return res.status(400).json({"message": "Dados invalidos"});
  }
}

exports.editUser = async function insert(req, res) {

  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let cpf = req.body.cpf;

  if(email != null && password != null && name != null && cpf != null) {
    await conn.query(`update users set email = '` + email + `', password = '` + password + `',name = '` + name + `',cpf = '` + cpf + `' where id = ` + id + ``, function (err, result) {
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

exports.updateAdmin = async function insert(req, res) {

  let id = req.body.id;
  let admin = req.body.admin;
  
  if(id != null && admin != null) {
    await conn.query(`update users set admin = ` + admin + ` where id = ` + id + ``, function (err, result) {
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

exports.show = async function show(req, res) {
  await conn.query(`select * from users`, function (err, result) {
    if (err) {
        console.log(err);
        return res.status(400).send(err);
    }
    return res.status(200).json(result.rows)
  }); 
}