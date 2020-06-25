class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this.#fetchProducts();
        this.render();
    }

    #fetchProducts = function () {
        this.goods = [
            {id: 1, title: 'Notebook', price: 20000},
            {id: 2, title: 'Mouse', price: 1500},
            {id: 3, title: 'Keyboard', price: 5000},
            {id: 4, title: 'Gamepad', price: 4500}, 
            {id: 5}, 
        ];
    }

    get totalCost() {
        let total = this.goods.reduce(function(sum, item) {
            let price = 0;
            if (item.hasOwnProperty('price') && !Number.isNaN(item.price)) {
                price = item.price;
            }
            return sum + price;
        }, 0);
        return total;
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObject = new ProductItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render())
        }
    }
}

class ProductItem {
    constructor(product, img = 'https://placehold.it/280x150') {
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id}">
                    <img src="${this.img}" alt="product image">
                    <h3>${this.title}</h3>
                    <p>Цена: ${this.price} \u20bd</p>
                    <button class="by-btn">Добавить в корзину</button>
                </div>`;
    }
}

// class Basket {
//     constructor(container = '.basket', user) {
//         this.user = user;
//         this.container = container;
//         this.selectedProducts = [];
//         this.basketList = [];
//         this.#fetchCart();
//         this.render();
//     }

//     #fetchCart = function () {
//         // получение id отобранных товаров и количеств для юзера 
//     }

//     render() {
//         // Организация отображения набора из BasketItem 
//     }
// }

// class BasketItem {
//     constructor(product, img) {
//         this.product = product;
//         this.img = img;
//     }

//     render() {
//         // Отображение индивидуальных BasketItem
//     }
// }

let plist = new ProductList();
console.log(plist.totalCost);