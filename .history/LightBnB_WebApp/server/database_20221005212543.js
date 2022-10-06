const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const query = `
  SELECT * FROM users
  WHERE email = $1
  LIMIT 1
  `;
  return pool.query(query, [email]).then((result) => {
    if (result.rows) {
      console.log("found user with email", result.rows[0]);
      return result.rows[0];
    }
    return null;

  }).catch((err) => {
    console.log(err.message);

  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const query = `
  SELECT * FROM users
  WHERE id = $1
  LIMIT 1
  `;
  return pool.query(query, [id]).then((result) => {
    if (result.rows) {
      console.log("found user with id", result.rows[0]);
      return result.rows[0];
    }
    return null;

  }).catch((err) => {
    console.log(err.message);

  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const query = `
  INSERT INTO users(name, email, password)
  VALUES ($1, $2, $3) 
  RETURNING *;
  `;
  return pool.query(query, [user.name, user.email, user.password])
    .then((result) => {
      console.log("user saved", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  /*   return getAllProperties(null, 2);  */

  const query = `
            SELECT
            properties.*,
            reservations.*,
            avg(property_reviews.rating) as average_rating
          FROM
            reservations
            JOIN properties ON reservations.property_id = properties.id
            JOIN property_reviews ON properties.id = property_reviews.property_id
          WHERE
            reservations.guest_id = $1
          GROUP BY
            properties.id,
            reservations.id
          ORDER BY
            reservations.start_date
          LIMIT
            $2;
  `;

  return pool.query(query, [guest_id, limit])
    .then((result) => {
      console.log("My reservations ", result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if(options.owner_id) {
    queryParams.push(options.owner_id);
    queryString
    queryString += ` properties.owner_id = $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;