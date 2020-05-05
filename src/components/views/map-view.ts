// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { html, customElement, TemplateResult, CSSResult, css } from 'lit-element';
import { BaseView } from './BaseView';

@customElement('map-view')
export class MapView extends BaseView {
    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
                display: grid;
                font-family: var(--font-family);
                background-color: var(--view-background-color);
            }

            .header {
                display: flex;
                flex-direction: column;
                justify-content: center;
                background-color: #ffffff;
                height: var(--nav-height);
                padding: 0 12px;

                /* Removed from design */
                display: none;
            }

            .header > div {
                display: flex;
                align-items: baseline;
            }

            .header--icon {
                width: 12px;
                height: 12px;
                margin-right: 4px;
                color: var(--nav-color);
            }

            .header--title {
                color: var(--nav-color);
                opacity: var(--nav-opacity);
            }

            .header--address {
                margin-top: 8px;
                font-size: var(--map-address-font-size);
                font-weight: 700;
            }

            .header--edit {
                color: var(--accent-color);
                margin-left: 20px;
                cursor: pointer;
            }

            .map {
                overflow: hidden;
            }

            .map > img {
                height: auto;
                width: 100%;
            }
        `;
    }

    render(): TemplateResult {
        return html`
            <div class="header">
                <div>
                    <div class="header--icon">
                        <img src="./assets/location-map.png" />
                    </div>
                    <div class="header--title">Current store:</div>
                </div>
                <div>
                    <div class="header--icon"></div>
                    <div class="header--address">15625 NE 8th St, Bellevue, WA 98008</div>
                    <div class="header--edit">Edit</div>
                </div>
            </div>
            <div class="map">
                <img src="./assets/map.png" />
            </div>
        `;
    }
}
