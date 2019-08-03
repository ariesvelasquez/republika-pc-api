

// Item pojo class
class Item {
    constructor(
        title, 
        price, 
        description, 
        seller,
        date,
        sellerUrl,
        postUrl
        ) {

        
        this.title = title;
        this.price = price;
        this.description = description;
        this.seller = seller;
        this.date = date;
        this.sellerUrl = sellerUrl;
        this.postUrl = postUrl;
    }
}

module.exports = Item;
