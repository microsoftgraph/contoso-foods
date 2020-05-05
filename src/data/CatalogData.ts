// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ItemModel, DescriptionPart } from '../models/ItemModel';
import { Providers, prepScopes } from '@microsoft/mgt';

export class CatalogData {
    private static _catalogData: Array<ItemModel>;
    private static getCatalogData(): Array<ItemModel> {
        if (!this._catalogData) {
            this._catalogData = new Array<ItemModel>();

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const json = require('../data/catalog.json');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            json.items.forEach((item: any) => {
                this._catalogData.push(
                    new ItemModel(
                        item['title'] as string,
                        item['name'] as string,
                        item['description'] as string,
                        item['description-parts'] as Array<DescriptionPart>,
                        item['price'] as number,
                        item['strike-price'] as number,
                        item['quantity'] as number,
                        item['ingredients'] as string,
                        item['allergens'] as string,
                        item['hero'] as string,
                        item['thumbnail'] as string,
                    ),
                );
            });
        }
        return this._catalogData;
    }

    public static getByTaskData(dataContext: any): ItemModel {
        let title: string = dataContext.task.title;
        let quantity = 1;

        // Determine if we have a quantity with regex
        const regex = new RegExp('^\\d+\\s\\w*');
        if (regex.test(title)) {
            const quantityStr = title.substring(0, title.indexOf(' '));
            quantity = parseInt(quantityStr);
            title = title.substring(quantityStr.length + 1);
        }

        const catalogData = this.getCatalogData();
        const item = catalogData.find(v => v.name === title);

        if (!item) {
            return null;
        }

        item.quantity = quantity;
        item.dataContext = dataContext;

        return item;
    }

    public static async updateAsync(item: ItemModel): Promise<ItemModel> {
        const listId: string = item.dataContext['list']['id'];
        const taskId: string = item.dataContext['task']['id'];
        const task: any = {
            title: `${item.quantity} ${item.name}`,
        };

        const client = Providers.globalProvider.graph;
        const newItemDataContext = await client
            .api(`/me/todo/lists/${listId}/tasks/${taskId}`)
            .version('beta')
            .middlewareOptions(prepScopes('Tasks.ReadWrite'))
            .patch(task);

        item.dataContext.task = newItemDataContext;
        return item;
    }
}
