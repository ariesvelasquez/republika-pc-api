

// Item pojo class
class Item {
    constructor(
        name, 
        price, 
        seller,
        date,
        link_id,
        page,
        is_empty,
        is_feed
        ) {
        
        this.name = name;
        this.price = price;
        this.seller = seller;
        this.date = date;
        this.link_id = link_id;
        this.page = page;
        this.is_empty = is_empty;
        this.is_feed = is_feed;
    }
}

module.exports = Item;
