CREATE TABLE rates(
  id SERIAL NOT NULL,
  start_date DATE,
  end_date DATE,
  cost_per_night INTEGER,
  property_id REFERENCES properties(id)
);

CREATE TABLE guest_reviews(
  
);