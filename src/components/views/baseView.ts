// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LitElement } from 'lit-element';

export abstract class BaseView extends LitElement {
    /**
     * Update the state of the view
     *
     * @param {object} [parameter]
     * @memberof BaseView
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public load(parameter?: object): void {
        // empty
    }

    /**
     * Unload state from the view
     */
    public unload(): void {
        // empty
    }
}
