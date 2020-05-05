// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export class DescriptionPart {
    public title?: string;
    public lines: string[];

    constructor(title: string, lines: string[]) {
        this.title = title;
        this.lines = lines;
    }
}

export class ItemModel {
    public title: string;
    public name: string;
    public description: string;
    public descriptionParts: Array<DescriptionPart>;
    public price: number;
    public strikePrice: number;
    public quantity: number;
    public ingredients: string;
    public allergens: string;
    public hero: string;
    public thumbnail: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public dataContext: any;

    constructor(
        title: string,
        name: string,
        description: string,
        descriptionParts: Array<DescriptionPart>,
        price: number,
        strikePrice: number,
        quantity: number,
        ingredients: string,
        allergens: string,
        hero: string,
        thumbnail: string,
    ) {
        this.title = title;
        this.name = name;
        this.description = description;
        this.descriptionParts = descriptionParts;
        this.price = price;
        this.strikePrice = strikePrice;
        this.quantity = quantity;
        this.ingredients = ingredients;
        this.allergens = allergens;
        this.hero = hero;
        this.thumbnail = thumbnail;
    }
}
