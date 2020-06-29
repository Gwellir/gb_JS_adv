const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses'
const basketIsEmpty = '<p>Корзина пуста!</p>'
const tableTemplate = `<h3>Корзина</h3>
    <table class="basket-table">
    <tbody>
        <tr class="basket-header">
            <th>Товар</th>
            <th>Цена</th>
            <th>Кол-во</th>
        </tr>
    </tbody>
    </table>`


// Rework with promises
// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status !== 200) {
//                 console.log('Error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     };
//     xhr.send();
// }

let getRequestPromise = (url) => {
    return new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    rej(`Error! ${xhr.status}: "${xhr.statusText}"`);
                } else {
                    res(xhr.responseText);
                }
            }
        };
        xhr.send();
    });
}

class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._getProducts()
            .then(data => {
                this.goods = [...data];
                this.render();
                this.buyButtonElems = document.querySelectorAll('.buy-btn');
            });
    }

    _getProducts() {
        // return fetch(`${API}/catalogData.json`)
        //     .then(response => response.json())
        //     .catch(error => {
        //         console.log(error);
        //     });
        return getRequestPromise(`${API}/catalogData.json`)
            .then(response => JSON.parse(response))
            .catch(error => {
                console.log(error);
            })
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
        console.log(`Total product cost is: ${this.totalCost}`);
    }
}

class ProductItem {
    constructor(product, img = 'https://placehold.it/280x150') {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id}">
                    <img src="${this.img}" alt="product image">
                    <h3>${this.title}</h3>
                    <p>Цена: ${this.price} \u20bd</p>
                    <button class="buy-btn">Добавить в корзину</button>
                </div>`;
    }
}

class Basket {
    constructor(container = '.basket') {
        // this.user = user;
        this.basketElem = document.querySelector(container);
        this.cartButton = document.getElementById('btn-cart');
        this.cartButton.addEventListener('click', () => {
            this._switchBasketDisplay();
        });
        // this.selectedProducts = [];
        this.basketList = [];
        this._fetchBasket()
            .then(data => {
                this._updateBasketView(data);
                this.removeButtonElems = document.querySelectorAll('.remove-btn');
                this._applyBasketListeners();
            });
    }

    _getBasketProductById(id) {
        return this.basketList.filter( (item) => item.id_product === id)[0];
    }

    _applyBasketListeners() {
        console.log(this.removeButtonElems);
        // console.log(this.buyButtonElems);
        for (let rmButton of this.removeButtonElems) {
            rmButton.addEventListener('click', () => {
                this.removeItem(this._getBasketProductById(+rmButton.dataset.productId));
            });
        }
        // for (let buyButton of this.buyButtonElems) {
        //     buyButton.addEventListener('click', () => {
        //         this.addItem(this._getBasketProductById(+buyButton.parent.dataset.id));
        //     });
        // }
    }
    
    _clearBasketView() {
        // очистка .basket
        let el = this.basketElem;
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    _updateBasketView(data) {
        // распаковка данных корзины и отрисовка
        this.basketList = [...data['contents']];
        this.total = data['amount'];
        this.positionCount = data['countGoods'];
        this.render();
    }

    _fetchBasket() {
        // получение содержимого корзины с сервера
        return fetch(`${API}/getBasket.json`)
            .then(response => response.json())
            .catch(error => {
                console.log(error);
            });
    }

    _switchBasketDisplay() {
        // отображение и скрытие корзины
        this.basketElem.classList.toggle('hidden-element')
    }

    _modifyBasket(product, action) {
        // Выполнение серверных изменений корзины
        console.log(`Trying to perform basket '${action}' on ${product.product_name} (${product.id_product})`);
        let apiAction = (action === 'delete' ? 'deleteFromBasket' : 'addToBasket');
        fetch(`${API}/${apiAction}.json`)
            .then(response => response.json())
            .then(data => {
                if (data['result'] !== 1) {
                    throw `Error while performing '${action}' on ${product.product_name} (${product.id_product}): ${data['result']}`;
                } else {
                    this._fetchBasket()
                        .then(data => {
                            this._updateBasketView(data);
                            this.removeButtonElems = document.querySelectorAll('.remove-btn');
                            this._applyBasketListeners();
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    addItem(product) {
        // добавление единицы продукта в корзину
        this._modifyBasket(product, 'add');
    }

    removeItem(product) {
        // удаление продукта из корзины
        this._modifyBasket(product, 'delete');
    }

    render() {
        // Организация отображения набора из BasketItem 
        this._clearBasketView();
        if (!this.basketList) {
            this.basketElem.insertAdjacentHTML('beforeend', basketIsEmpty)
        } else {
            this.basketElem.insertAdjacentHTML('beforeend',
                `${tableTemplate}
                <p>В корзине товаров: <span id="total-cost-field">${this.positionCount}</span></p>
                <p>Общая стоимость: <span id="total-amount-field">${this.total}</span> \u20bd</p>`);
            let tableElem = this.basketElem.querySelector('.basket-table > tbody');
            for (let item of this.basketList) {
                let basketObject = new BasketItem(item);
                tableElem.insertAdjacentHTML('beforeend', basketObject.render())
            }
        }
    }
}

class BasketItem {
    constructor(position) {
        this.id = position.id_product;
        this.title = position.product_name;
        this.price = position.price;
        this.quantity = position.quantity;
        // this.img = img;
    }

    render() {
        // Отображение индивидуальных BasketItem
        return `<tr class="basket-row" data-basket-id="${this.id}">
                    <td>${this.title}</td>
                    <td>${this.price} \u20bd</td>
                    <td>${this.quantity}</td>
                    <td><button class="remove-btn" data-product-id="${this.id}">удалить</button></td>
                </tr>`;
    }
}

let plist = new ProductList();
let basket = new Basket();
