export default {
    addInventory: `
        INSERT 
            INTO
                inventories(item_id, quantity, expiry)
        VALUES($1, $2, $3)
    
    `,
    addNewItem: `
        INSERT
            INTO
                item_types(name)
        VALUES($1)
        RETURNING *
    `,
    getAllAvailableItems: `
        SELECT
            inventories.id AS inventory_id,
            quantity
        FROM 
            inventories
        INNER JOIN item_types ON inventories.item_id = item_types.id AND item_types.name = $1
        WHERE 
            expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
        ORDER BY expiry ASC
    ;

    `,
    getItemByName: `
        SELECT
            *
        FROM
            item_types
        WHERE
            name = $1
    
    `,
    getInventoryQuantity: `
        SELECT
            (
                SELECT
                    COALESCE(SUM(quantity), 0) AS quantity
                FROM
                    inventories
                INNER JOIN item_types ON inventories.item_id = item_types.id AND item_types.name = $1
                WHERE 
                    expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
                GROUP BY item_id
            ),
            (
                SELECT
                    MIN(expiry) as valid_till
                FROM
                    inventories
                INNER JOIN item_types ON inventories.item_id = item_types.id AND item_types.name = $1
                WHERE 
                    expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
                GROUP BY item_id
            
            );
    `,
    updateItemQty: `
        UPDATE
            inventories
        SET
            quantity = $1,
            updated_at = NOW()
        WHERE
            id = $2
    `,
    deleteExpiredInventories: ` 
        DELETE 
            FROM 
                inventories
        WHERE 
            expiry < ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
    `
}
