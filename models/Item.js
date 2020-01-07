

// Item pojo class
class Item {
    constructor(
        name, 
        price, 
        seller,
        date,
        link_id,
        page,
        isEmpty
        ) {
        
        this.name = name;
        this.price = price;
        this.seller = seller;
        this.date = date;
        this.link_id = link_id;
        this.page = page;
        this.isEmpty = isEmpty;
    }
}

module.exports = Item;
