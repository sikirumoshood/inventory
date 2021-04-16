/* Replace with your SQL commands */
CREATE OR REPLACE function sell_item(item varchar, qty numeric)
RETURNS VOID
language plpgsql
AS
$$
DECLARE
   total_items integer;
BEGIN
    LOCK TABLE inventories IN SHARE ROW EXCLUSIVE MODE;
	SELECT INTO total_items
            COUNT(inventories.id)
        FROM 
            inventories
        INNER JOIN item_types ON inventories.item_id = item_types.id
        WHERE 
            expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
        AND 
            item_types.name = item;
    
	IF (total_items > 0) 
	THEN 
		IF (qty > total_items)
			THEN 
				RAISE EXCEPTION using
	            errcode='NOBAR',
	            message='QTY_REQUESTED_ABOVE_STOCK_LIMIT',
	            hint='Qty of items requested is above the available items';
		ELSE 
			RAISE NOTICE ' % Items still in stock', total_items;
			DELETE
			FROM
		        inventories
		    WHERE
		        id IN (
		            SELECT
		                i.id 
		            FROM 
		                inventories i
		            INNER JOIN item_types ON i.item_id = item_types.id
		            WHERE 
		                item_types.name = item
		            AND 
		                expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
		            LIMIT qty
		        );
		END IF;
		
	ELSE  RAISE EXCEPTION using
            errcode='NOBAR',
            message='ITEM_NO_LONGER_IN_STOCK',
            hint='Item must have been sold out';
	END IF;
	RETURN;
END;
$$;
