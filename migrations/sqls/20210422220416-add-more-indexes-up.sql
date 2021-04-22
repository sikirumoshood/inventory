/* Replace with your SQL commands */
CREATE INDEX IF NOT EXISTS item_id_index ON item_types(id);
CREATE INDEX IF NOT EXISTS inventory_id_index ON inventories(id);
CREATE INDEX IF NOT EXISTS inventory_item_id_index ON inventories(item_id);
CREATE INDEX IF NOT EXISTS quantity_index ON inventories(quantity);
