/**
 * Represents a non-standard source of value that a dice face can represent.
 * For example, in a game where dice produce both energy and money, you may wish to track
 * those the likelihood of receiving a given amount of each of those products.
 */
export default class Product {
    constructor({ value, name, icon }) {
        this.value = value;
        if(name === undefined && value !== undefined && value instanceof 'integer') {
            this.name = value.toString();
        }
        else {
            this.name = name;
        }
        this.icon = icon;
        this.clone = this.clone.bind(this);
    }

    clone() {
        return new Product( { 
            value : this.value,
            name : this.name,
            icon : this.icon
        });
    }
}