SELECT
  properties.id AS id,
  properties.cost_per_night AS cost_per_night,
  AVG(property_reviews.rating) AS average_rating
FROM
  properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE
  property_reviews.rating >= 4
  AND properties.city = 'Vancouver'
ORDER BY
  cost_per_night
LIMIT
  10;