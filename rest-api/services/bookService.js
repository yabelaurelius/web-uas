const db = require('../db');
const config = require('../config/config');
const helper = require('../lib/helper');

async function findOneById(id) {
  console.log(id, "Hello")

  const row = await db.query(
    `SELECT *
        FROM book
        WHERE id = ?`,
    [id]
  );

  console.log(row)

  return row;
}

async function findMany(page = 1) {
  const offset = helper.getOffset(page, 10);

  const rows = await db.query(
    `SELECT * 
    FROM book
    LIMIT ?,?`,
    [offset, 10]
  );
  const data = rows;
  const meta = { page };

  return {
    data,
    meta
  };
}

async function createOne(data = null) {
  if (data['price'] === undefined) data['price'] = 0;
  if (data['quantity'] === undefined) data['quantity'] = 0;

  const row = await db.query(
    `INSERT INTO book(title, author_id, price, quantity)
    VALUES (?, ?, ?, ?)`,
    Object.values(data)
  );

  return {
    "status": 200,
    "message": "New book data created."
  };
}

async function updateOneById(id, data = null) {

  if (data == null) return {
    "status": 400,
    "message": "No required data supplied. Update failed."
  };

  data = Object.entries(data);

  let setQuery = '';
  data.forEach((el, index) => {
    if (index != 0) setQuery += ', '
    setQuery += `${el[0]} = "${el[1]}"`;
  });

  const row = await db.query(
    `UPDATE book SET ${setQuery} WHERE id = ?`,
    [id]
  );


  return {
    "status": 200,
    "message": `Book of id ${id} successfully edited.`
  };

}

async function deleteOneById(id) {
  const row = await db.query(
    `UPDATE book
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [id]
  );

  return {
    "status": 200,
    "message": `Book of id ${id} is successfully deleted.`
  };
}

module.exports = {
  findOneById,
  findMany,
  createOne,
  updateOneById,
  deleteOneById
}