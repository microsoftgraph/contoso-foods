// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { html, customElement, TemplateResult, CSSResult, css } from 'lit-element';
import { BaseView } from './BaseView';

@customElement('splash-view')
export class SplashView extends BaseView {
    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: calc(100% - 50px);
                padding: 32px;
                background-color: #e5e5e5;
            }

            .splash--clouds {
                margin-bottom: 50px;
                float: right;
            }
        `;
    }

    public render(): TemplateResult {
        return html`
            <div>
                <img class="splash--clouds" src="./assets/splash-clouds.png" />
                <img class="splash--truck" src="./assets/splash-truck.png" />
            </div>
        `;
    }
}
