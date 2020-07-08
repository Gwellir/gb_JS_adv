const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        basketUrl: '/getBasket.json',
        products: [],
        filtered: [],
        cartContents: [],
        imgCatalog: 'https://placehold.it/200x150',
        imgCart: 'https://placehold.it/80x50',
        searchLine: '',
        isVisibleCart: true,
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product){
            console.log(product.id_product);
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let found = this.cartContents.find(elem => elem.id_product === product.id_product);
                        if (found) {
                            found.quantity++;
                        } else {
                            let item = Object.assign({quantity: 1}, product);
                            this.cartContents.push(item);
                        }
                    }
                })
        },
        removeProduct(product) {
            this.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if (product.quantity > 1) {
                            product.quantity--;
                        } else {
                            this.cartContents.splice(this.cartContents.indexOf(product), 1);
                        }
                    }
                })
        },
        filterGoods(pattern) {
            console.log(`filtering by: "${pattern}"`);
            const re = new RegExp(pattern, 'i');
            this.filtered = this.products.filter(product => re.test(product.product_name));
            this.products.forEach(item => {
                const block = document.querySelector(`.product-item[data-id="${item.id_product}"]`);
                if (!this.filtered.includes(item)) {
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible');
                }
            })
        },
    },
    created() {
        console.log('created');
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for(let item of data){
                    this.products.push(item);
                }
                this.filtered = [...this.products];
            });
        this.getJson(`${API + this.basketUrl}`)
            .then(data => {
                for(let item of data.contents){
                    this.cartContents.push(item);
                }
            });
    },
});
