const db = require('../db');
const config = require('../config/config');
const helper = require('../lib/helper');

async function findOneById(id) {
  const row = await db.query(
    `SELECT *
        FROM transaction
        WHERE id = ?`,
    [id]
  );

  return row;
}

async function findMany(page = 1) {
  const offset = helper.getOffset(page, 10);

  const rows = await db.query(
    `SELECT * 
    FROM transaction
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
  if (data['is_paid'] === undefined) data['is_paid'] = false;

  const row = await db.query(
    `INSERT INTO transaction(member_id, is_paid)
    VALUES (?, ?)`,
    Object.values(data)
  );

  return {
    "status": 200,
    "message": "New transaction data created."
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
    `UPDATE transaction SET ${setQuery} WHERE id = ?`,
    [id]
  );


  return {
    "status": 200,
    "message": `Transaction of id ${id} successfully edited.`
  };

}

async function deleteOneById(id) {
  const row = await db.query(
    `UPDATE transaction
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [id]
  );

  return {
    "status": 200,
    "message": `Transaction of id ${id} is successfully deleted.`
  };
}

module.exports = {
  findOneById,
  findMany,
  createOne,
  updateOneById,
  deleteOneById
}