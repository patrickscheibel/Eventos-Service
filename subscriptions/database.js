const { Pool } = require('pg');
const conn = new Pool ({
  host: 'localhost',
  port: '2000',
  user: 'postgres',
  password: 'postgres',
  database: 'subscription_pg',
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

conn.connect();

(async () => {
  await createTable();
})();

async function createTable() {
  await conn.query(`
    create table if not exists subscriptions (
      id SERIAL,
      event_id integer not null,
      user_id integer not null,
      subscribed_at TIMESTAMP not null,
      unsubscribed boolean not null,
      unsubscribed_at TIMESTAMP,
      checkin_at TIMESTAMP,
      primary key (id)
    )
  `);
  console.log('Table subscriptions created');
}

exports.create = async function (req, res) {
  let event_id = req.body.event_id;
  let user_id = req.body.user_id;

  if(event_id != null && user_id != null) {
    await conn.query(`insert into subscriptions (event_id, user_id, subscribed_at, unsubscribed) 
                      values (` + event_id + `,'` + user_id + `','` + formatDate(new Date()) + `',false) returning *`, 
                      function (err, result) {

      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }

      return res.status(200).json({"message": "Criado com Sucesso"})
    });
  } else {
    return res.status(400).json({"message": "Dados invalidos"})
  }
}

exports.list = async function (req, res) {
  await conn.query(`select * from subscriptions`, function (err, result) {
    if (err) {
        console.log(err);
        return res.status(400).send(err);
    }
    return res.status(200).json(result.rows)
  });
}

exports.searchSubscription = async function (req, res) {
  let id = req.body.id;

  if(id != null || id < 0) {
    await conn.query(`select * from subscriptions where id = ` + id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows)
    });
  } else {
    return res.status(400).json({"message": "Id invalido"});
  }
}

exports.listSubscriptionsUser = async function (req, res) {
  let user_id = req.body.user_id;

  if(user_id != null || user_id < 0) {
    await conn.query(`select * from subscriptions where user_id = ` + user_id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows)
    });
  } else {
    return res.status(400).json({"message": "Id invalido"});
  }
}

exports.checkedUserInEvent = async function (req, res) {
  let user_id = req.body.user_id;
  let event_id = req.body.event_id;

  if((user_id != null || user_id < 0) && (event_id != null || event_id < 0)) {
    await conn.query(`select * from subscriptions where user_id = ` + user_id + ` and event_id=` + event_id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows)
    });
  } else {
    return res.status(400).json({"message": "Id invalido"});
  }
}

exports.listSubscriptionsEvent = async function (req, res) {
  let event_id = req.body.event_id;

  if(event_id != null || event_id < 0) {
    await conn.query(`select * from subscriptions where event_id = ` + event_id + ``, function (err, result) {
      if (err) {
          console.log(err);
          return res.status(400).send(err);
      }
      return res.status(200).json(result.rows)
    });
  } else {
    return res.status(400).json({"message": "Id invalido"});
  }
}

exports.checkin = async function (req, res) {
  let id = req.body.id;

  if(id == null || id < 0) { 
    return res.status(400).send("Id invalido"); 
  } else {
    //Atualizar tabela e adicinar a data do dia no campo checkin_at, da subscrição informada pelo req
    await conn.query(`update subscriptions set checkin_at = '` + formatDate(new Date()) + `' where id = ` + id + ``, function (err, result) {
      if (err) {
          return res.status(400).send(err);
      }
      return res.status(200).json({"message": "Atualizado com Sucesso"});
    });
  }
}

exports.unsubscribed = async function (req, res) {
  let id = req.body.id;

  if(id == null || id < 0) { 
    return res.status(400).send("Id invalido"); 
  } else {
    //Atualizar tabela e alterar o campo de unsubscribed de "false" para "true", além de adicionar a data do dia no campo unsubscribed_at, da subscrição informada pelo req
    await conn.query(`update subscriptions set unsubscribed = `+ true + `, unsubscribed_at = '` + formatDate(new Date()) + `' where id = ` + id + ``, function (err, result) {
      if (err) {
          return res.status(400).send(err);
      }
      return res.status(200).json({"message": "Atualizado com Sucesso"});
    });
  }
}

formatDate = function (date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
}