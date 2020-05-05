// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { html, customElement, TemplateResult, CSSResult, css, PropertyDeclarations } from 'lit-element';
import { BaseView } from './BaseView';
import { ItemModel } from '../../models/ItemModel';
import { NavigationService } from '../../services/NavigationService';

@customElement('item-details-view')
export class ItemDetailsView extends BaseView {
    static get properties(): PropertyDeclarations {
        return { item: { type: ItemModel } };
    }

    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
                font-family: Segoe UI;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                background-color: #ffffff;
            }

            .hero {
                max-height: 50vh;
                background: #ffffff;
                display: flex;
                justify-content: center;
            }

            .hero img {
                width: 100%;
                height: auto;
            }

            .content-root {
                padding: 24px 12px 0 12px;
                display: flex;
            }

            .item--name {
                font-family: var(--font-family);
                font-size: var(--title-font-size);
                margin-bottom: 12px;
            }

            .item--price {
                font-family: var(--font-family);
            }

            .item--strike-price {
                font-family: var(--font-family);
                opacity: var(--nav-opacity);
                text-decoration: line-through;
                margin-left: 8px;
            }

            .item--description {
                margin-top: 24px;
                font-size: 14px;
            }

            .item--header {
                margin-top: 24px;
                font-weight: bold;
            }

            .metadata {
                width: 75%;
            }

            .nutrition {
                width: 135px;
                height: auto;
                max-height: 384px;
            }

            .description__part--title {
                margin-top: 24px;
                font-weight: bold;
            }

            .description__part--line {
                margin-top: 8px;
                font-size: 14px;
            }

            .go-back {
                position: absolute;
                margin: 12px;
                cursor: pointer;
                opacity: .5;
            }

            .go-back:hover {
                opacity: 1;
            }
        `;
    }

    private _item: ItemModel;
    public get item(): ItemModel {
        return this._item;
    }
    public set item(val) {
        const oldVal = this._item;
        this._item = val;
        this.requestUpdate('item', oldVal);
    }

    public load(parameter?: object): void {
        this.item = parameter as ItemModel;
    }

    public render(): TemplateResult {
        const descriptionParts: TemplateResult[] = [];
        if (this.item) {
            this.item.descriptionParts?.forEach(part => {
                if (part.title) {
                    descriptionParts.push(html`
                        <div class="description__part--title">${part.title}</div>
                    `);
                }

                part.lines.forEach(subPart => {
                    descriptionParts.push(html`
                        <div class="description__part--line">${subPart}</div>
                    `);
                });
            });
        }

        return html`
            <div class="hero">
                <img src="${this.item?.hero}" />
            </div>
            <div class="content-root">
                <div class="metadata">
                    <div class="item--name">${this.item?.title}</div>
                    <div>
                        <span class="item--price">$${this.item?.price}</span>
                        <span class="item--strike-price">$${this.item?.strikePrice}</span>
                    </div>
                    <div class="item--description">
                        ${descriptionParts}
                    </div>
                </div>
                <img class="nutrition" src="./assets/nutrition.png" />
            </div>
            <div class="go-back" @click=${() => NavigationService.goBack()}>
                <img src="./assets/back.png" />
            </div>
        `;
    }
}
