// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LitElement, TemplateResult, html, customElement, css, CSSResult, PropertyDeclarations } from 'lit-element';
import { CatalogData } from '../data/CatalogData';
import { ItemModel } from '../models/ItemModel';

@customElement('list-task')
export class ListTask extends LitElement {
    static get properties(): PropertyDeclarations {
        return { dataContext: { type: Object }, taskItem: { type: ItemModel }, quantity: { type: Number } };
    }

    private _quantitySub: HTMLElement;
    private _quantityAdd: HTMLElement;

    private _dataContext: any;
    public get dataContext(): any {
        return this._dataContext;
    }
    public set dataContext(val) {
        const oldVal = this._dataContext;
        this._dataContext = val;
        if (this.dataContext) {
            this.taskItem = CatalogData.getByTaskData(this.dataContext);
        }
        this.requestUpdate('dataContext', oldVal);
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
                min-width: 426px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-family);
                background: #ffffff;
                margin-bottom: 8px;
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

            .task__price {
                margin: 4px 0 0 0;
            }

            .task__price--current,
            .task__price--original {
                font-size: 18px;
            }

            .task__price--original {
                margin-left: 12px;
                opacity: var(--nav-opacity);
                text-decoration: line-through;
            }

            .quantity {
                display: flex;
                margin-right: 20px;
                margin-left: 4px;
            }

            .quantity--value {
                width: 32px;
                background: #ffffff;
                display: flex;
                font-size: 18px;
                align-items: center;
                justify-content: center;
            }

            .quantity--sub,
            .quantity--add {
                height: 24px;
                width: 24px;
                font-size: 14px;
                font-family: Segoe UI;
                color: var(--accent-color);
                background: rgba(0, 120, 212, 0.11);
                display: flex;
                align-items: baseline;
                justify-content: center;
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
                <div class="task__price">
                    <span class="task__price--current">$${this.taskItem?.price}</span>
                    <span class="task__price--original">$${this.taskItem?.strikePrice}</span>
                </div>
            </div>
            <div class="quantity">
                <div class="quantity--sub">-</div>
                <div class="quantity--value">${this.taskItem?.quantity}</div>
                <div class="quantity--add">+</div>
            </div>
        `;
    }

    firstUpdated(): void {
        this._quantitySub = this.shadowRoot.querySelector('.quantity--sub');
        this._quantitySub.addEventListener('click', (e) => this.updateQuantity(e, -1));

        this._quantityAdd = this.shadowRoot.querySelector('.quantity--add');
        this._quantityAdd.addEventListener('click', (e) => this.updateQuantity(e, +1));
    }

    private updateQuantity(e: Event, modifier: number) {
        const oldVal = this.taskItem.quantity;
        const newVal = Math.min(99, Math.max(1, this.taskItem.quantity + modifier));
        
        if (oldVal !== newVal) {
            this.taskItem.quantity = newVal;
            CatalogData.updateAsync(this.taskItem).then(updatedItem => {
                this.dataContext = updatedItem.dataContext;
                this.requestUpdate();
            });
        }

        e.preventDefault();
        e.stopPropagation();
    }
}
