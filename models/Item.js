

// Item pojo class
class Item {
    constructor(
        name, 
        price, 
        description, 
        seller,
        date,
        seller_url,
        link_id,
        is_ad,
        page
        ) {

        
        this.name = name;
        this.price = price;
        this.description = description;
        this.seller = seller;
        this.date = date;
        this.seller_url = seller_url;
        this.link_id = link_id;
        this.is_ad = is_ad;
        this.page = page;
    }
}

module.exports = Item;
