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
            VALUES($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;
    `,
    getAllAvailableItems: `
        SELECT
            COUNT(id)
        FROM 
            inventories
        INNER JOIN item_types ON inventories.item_id = item_types.id
        WHERE 
            expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
        AND 
            item_types.name = $1
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
    `,
    sellItems: `
        SELECT sell_item($1, $2);
    `
}
