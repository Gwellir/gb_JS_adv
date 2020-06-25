class Hamburger {
    constructor() {
        this.form = document.getElementById('hamburger-form')
        this.size = this.getSize();
        this.stuffing = this.getStuffing();
        this.toppings = this.getToppings();
        this.calories = this.calculateCalories();
        this.cost = this.calculatePrice();
        this.totalCostElem = document.getElementById('cost');
        this.totalCaloriesElem = document.getElementById('calories');
        this.fillTotals();
    }

    getToppings() {
        let toppingInputs = Array.from(this.form.querySelectorAll('input[name="topping"]'));
        return toppingInputs.filter( (topping) => {
            return topping.checked == true;
        }).map( (item) => {
            return {
                name: item.value,
                price: +item.dataset.price,
                calories: +item.dataset.calories,
            }
        });
    }

    getSize() {
        let sizeInputs = Array.from(this.form.querySelectorAll('input[name="size"]'));
        return sizeInputs.filter( (size) => {
            return size.checked == true;
        }).map( (item) => {
            return {
                name: item.value,
                price: +item.dataset.price,
                calories: +item.dataset.calories,
            }
        })[0];
    }

    getStuffing() {
        let stuffingInputs = Array.from(this.form.querySelectorAll('input[name="stuffing"]'));
        return stuffingInputs.filter( (stuffing) => {
            return stuffing.checked == true;
        }).map( (item) => {
            return {
                name: item.value,
                price: +item.dataset.price,
                calories: +item.dataset.calories,
            }
        })[0];
    }

    calculatePrice() {
        return this.stuffing.price + this.size.price + this.toppings.reduce( (sum, item) => {
            return sum + item.price
        }, 0)
    }

    calculateCalories() {
        return this.stuffing.calories + this.size.calories + this.toppings.reduce( (sum, item) => {
            return sum + item.calories
        }, 0)
    }

    fillTotals() {
        this.totalCaloriesElem.textContent = this.calories;
        this.totalCostElem.textContent = this.cost;
    }
}

let ham = new Hamburger();

document.getElementById('calc').addEventListener('click', () => {
    console.log('Recalculating...');
    ham = new Hamburger();
});
