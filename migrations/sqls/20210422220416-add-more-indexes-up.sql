/* Replace with your SQL commands */
CREATE INDEX item_id_index ON item_types(id);
CREATE INDEX inventory_id_index ON inventories(id);
CREATE INDEX inventory_item_id_index ON inventories(item_id);
CREATE INDEX quantity_index ON inventories(quantity);
