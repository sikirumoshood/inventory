/* Replace with your SQL commands */
CREATE OR REPLACE function sell_item(item numeric, qty numeric)
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
        WHERE 
            expiry > ( EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000 )
        AND 
            inventories.item_id = item;
    
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
		            WHERE 
		                i.item_id = item
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
