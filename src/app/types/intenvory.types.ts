type Item = {
    itemName: string,
    quantity: number,
    expiry: number
};

type ItemWithId = Item & { id: string, itemName?: string }

type Empty = {}

type QuantityResult = {
    quantity: number,
    validTill: number | null
}

type EmptyQuantityResult = {
    quantity: 0,
    validTill: null
}

type SellRequestData = {
    quantity: number,
    itemName: string
}

export {
    Item,
    ItemWithId,
    Empty,
    QuantityResult,
    EmptyQuantityResult,
    SellRequestData
};
