// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LitElement, TemplateResult, html, customElement, css, CSSResult, PropertyDeclarations } from 'lit-element';
import { CatalogData } from '../data/CatalogData';
import { ItemModel } from '../models/ItemModel';
import { NavigationService } from '../services/NavigationService';
import { MapView } from './views/map-view';

@customElement('shopping-task')
export class ShoppingTask extends LitElement {
    static get properties(): PropertyDeclarations {
        return { dataContext: { type: Object }, taskItem: { type: ItemModel } };
    }

    private _dataContext: object;
    public get dataContext(): object {
        return this._dataContext;
    }
    public set dataContext(val) {
        this._dataContext = val;
        if (this.dataContext) {
            this.taskItem = CatalogData.getByTaskData(this.dataContext);
        }
    }

    private _taskItem: ItemModel;
    public get taskItem(): ItemModel {
        return this._taskItem;
    }
    public set taskItem(val) {
        const oldVal = this._taskItem;
        this._taskItem = val;
        this.requestUpdate('taskItem', oldVal);
    }

    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
                width: 100%;
                min-width: var(--shopping-task-width);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-family);
                background: #ffffff;
            }

            :host .selected {
                opacity: 0.5;
            }

            .task--image img {
                height: var(--task-image-height);
                width: var(--task-image-width);
            }

            .task--content {
                flex-grow: 1;
                margin-left: 12px;
            }

            .task--title {
                font-size: var(--task-title-font-size);
            }

            .task__quantity {
                margin: 2px 0 4px 0;
            }

            .task__quantity--label {
                color: #8c8c8c;
            }

            .task--price,
            .task--strike-price {
                font-size: 18px;
            }

            .task--strike-price {
                margin-left: 12px;
                opacity: var(--nav-opacity);
                text-decoration: line-through;
            }
            
            .task--location {
                margin-right: 20px;
                cursor: pointer;
            }
        `;
    }

    render(): TemplateResult {
        return html`
            <div class="task--image">
                <img src="${this.taskItem?.thumbnail || './assets/products/empty-icon.png'}" />
            </div>
            <div class="task--content">
                <div class="task--title">${this.taskItem?.title}</div>
                <div class="task__quantity">
                    <span class="task__quantity--label">Qty:</span>
                    <span class="task__quantity--value">${this.taskItem?.quantity}</span>
                </div>
                <div>
                    <span class="task--price">$${this.taskItem?.price}</span>
                    <span class="task--strike-price">$${this.taskItem?.strikePrice}</span>
                </div>
            </div>
            <div class="task--location" @click=${() => NavigationService.navigate(MapView)}>
                <img src="./assets/location-list.png" />
            </div>
        `;
    }
}
