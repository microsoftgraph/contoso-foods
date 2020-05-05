// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LitElement, html, customElement, TemplateResult, CSSResult, css } from 'lit-element';
import { BaseView } from './views/BaseView';

@customElement('view-host')
export class ViewHost extends LitElement {
    private _hostRoot: HTMLElement = null;
    private _currentView: BaseView = null;

    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
            }

            .host-root {
                height: 100%;
            }

            .host-root > * {
                height: 100%;
            }
        `;
    }

    firstUpdated(): void {
        this._hostRoot = this.shadowRoot.querySelector('.host-root');
    }

    render(): TemplateResult {
        return html`
            <div class="host-root"></div>
        `;
    }

    /**
     *
     *
     * @readonly
     * @type {BaseView}
     * @memberof ViewHost
     */
    public get currentView(): BaseView {
        return this._currentView;
    }

    /**
     * Change the actively displayed view.
     *
     * @param view
     * @param parameter
     */
    public async navigate(view: BaseView): Promise<void> {
        // Clear the contents of the host
        while (this._hostRoot.firstChild) {
            this._hostRoot.firstChild.remove();
        }

        // Append the new view
        this._hostRoot.appendChild(view);

        // Update the current view
        this._currentView = view;
    }
}
