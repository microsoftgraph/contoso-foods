// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { html, customElement, TemplateResult, CSSResult, css, LitElement } from 'lit-element';
import { NavigationService } from '../services/NavigationService';
import { ListView, ShoppingView, SplashView } from './views';
import { MapView } from './views/map-view';
import { BaseView } from './views/BaseView';

@customElement('nav-panel')
export class NavPanel extends LitElement {
    public static default: NavPanel;
    private static _listNavItem: HTMLElement;
    private static _shoppingNavItem: HTMLElement;

    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 0 12px;
                background: #ffffff;
                font-family: var(--font-family);
                height: var(--nav-height);
            }

            .logo {
                margin-left: 4px;
            }

            .nav {
                display: flex;
                align-items: center;
            }

            .nav__item {
                margin: 0 12px;
                padding: 4px 0;
                border-bottom: 2px solid transparent;
                box-sizing: border-box;
                color: var(--nav-color);
                opacity: var(--nav-opacity);
                font-weight: var(--nav-font-weight);
                font-size: var(--nav-font-size);
                white-space: nowrap;
                cursor: pointer;
            }

            .nav__item.selected {
                color: var(--nav-selected-color);
                opacity: var(--nav-selected-opacity);
                border-color: var(--accent-color);
            }

            @media screen and (max-width: 600px) {
                .optional {
                    display: none;
                }
            }
        `;
    }

    render(): TemplateResult {
        return html`
            <img class="logo" src="assets/logo.png" />
            <div class="nav">
                <div class="nav__item nav__item--list selected" @click=${this.onListClick}>My List</div>
                <div class="nav__item nav__item--shopping" @click=${this.onShoppingClick}>Go Shopping</div>
                <div class="nav__item optional">Pantry</div>
                <div class="nav__item optional">Recipes</div>
                <mgt-login></mgt-login>
            </div>
        `;
    }

    firstUpdated(): void {
        NavPanel.default = this;
        NavPanel._listNavItem = this.shadowRoot.querySelector('.nav__item--list');
        NavPanel._shoppingNavItem = this.shadowRoot.querySelector('.nav__item--shopping');
    }

    private onListClick(e: { target: HTMLElement }): void {
        const selectionChanged = this._updateSelection(e.target);
        if (selectionChanged) {
            NavigationService.navigate(ListView);
        }
    }

    private onShoppingClick(e: { target: HTMLElement }): void {
        const selectionChanged = this._updateSelection(e.target);
        if (selectionChanged) {
            NavigationService.navigate(ShoppingView);
        }
    }

    private _updateSelection(element: HTMLElement): boolean {
        const selected = this.shadowRoot.querySelector('.selected');
        if (selected !== element) {
            selected.classList.remove('selected');
            element.classList.add('selected');
            return true;
        }
        return false;
    }

    public updateSelection(viewType: new () => BaseView): void {
        switch (viewType) {
            case ListView:
                this._updateSelection(NavPanel._listNavItem);
                break;
            case ShoppingView:
                this._updateSelection(NavPanel._shoppingNavItem);
                break;
        }
    }
}
