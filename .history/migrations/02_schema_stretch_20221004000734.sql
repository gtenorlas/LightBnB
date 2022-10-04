CREATE TABLE rates(
  id SERIAL NOT NULL,
  start_date DATE,
  end_date DATE,
  cost_per_night INTEGER,
  property_id REFERENCES properties(id) CASCADE ON DELETE
);

CREATE TABLE guest_reviews(
  id SERIAL NOT NULL,
  guest_id REFERENCES users(id) NOT NULL CASCADE ON DELETE,
  owner_id REFERENCES users(id) NOT NULL CASCADE ON DELETE,
  reservation_id REFERENCES reservations
);