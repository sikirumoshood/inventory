/* Replace with your SQL commands */
CREATE TABLE inventories (
    id SERIAL PRIMARY KEY,
    item_id INTEGER,
    quantity NUMERIC NOT NULL,
    expiry NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_item
      FOREIGN KEY(item_id) 
	    REFERENCES item_types(id)
);

