

// Item pojo class
class Item {
    constructor(
        title, 
        price, 
        description, 
        seller,
        date,
        sellerUrl,
        postUrl,
        page
        ) {

        
        this.title = title;
        this.price = price;
        this.description = description;
        this.seller = seller;
        this.date = date;
        this.sellerUrl = sellerUrl;
        this.postUrl = postUrl;
        this.page = page;
    }
}

module.exports = Item;
