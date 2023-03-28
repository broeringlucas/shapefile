const db = require('../config/db');

class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  save() {
    let d = new Date();
    let yyyy= d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd= d.getDate();

    let createdAtDate = `${yyyy}-${mm}-${dd}`;
    
    let sql = `
    INSERT INTO tabela_teste (
      title,
      body,
      created_at
    )
    VALUES(
      '${this.title}',
      '${this.body}',
      '${createdAtDate}'
    )`
    
    ;
  
    return db.execute(sql);

  }

  static findAll() {
    let sql = "SELECT * FROM tabela_teste;";

    return db.execute(sql);
  }

  static findById(id) {
    let sql = `SELECT * FROM tabela_teste WHERE id = ${id};`;

    return db.execute(sql);
  }

  static deleteById(id) {
    let sql = `DELETE FROM tabela_teste WHERE id = ${id};`;

    return db.execute(sql);
  }

}

module.exports = Post