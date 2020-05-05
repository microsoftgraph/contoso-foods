// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { html, customElement, TemplateResult, CSSResult, css } from 'lit-element';
import { BaseView } from './BaseView';
import { NavigationService } from '../../services/NavigationService';
import { ItemDetailsView } from './item-details-view';
import { CatalogData } from '../../data/CatalogData';
import { Providers, ProviderState } from '@microsoft/mgt';
import { ListTask } from '../list-task';

/**
 * a view to display and manipulate the active shopping list items
 */
@customElement('list-view')
export class ListView extends BaseView {
    static get styles(): CSSResult {
        return css`
            :host {
                all: initial;
                display: flex;
                flex-direction: column;
                font-family: var(--font-family);
                background-color: var(--view-background-color);
            }

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px 12px 4px 12px;
            }

            .title {
                font-size: var(--title-font-size);
            }

            .add {
                color: var(--accent-color);
                cursor: pointer;
            }

            .list {
                overflow-y: auto;
            }

            list-task.selected {
                background-color: var(--task-selected-color);
            }

            mgt-todo {
                background-color: transparent;
                --task-margin: 0 0 10px 0;
            }
        `;
    }

    private _loading: boolean;
    private _selected: HTMLElement;
    private _taskListId: string;

    constructor() {
        super();
        this.loadData(true);
    }

    public render(): TemplateResult {
        const tasks =
            this._loading || !this._taskListId
                ? null
                : html`
                    <mgt-todo
                        hide-header
                        .targetId=${this._taskListId}
                        @templateRendered=${this.onTemplateRendered}
                    >
                        <template data-type="task"></template>
                    </mgt-todo>
                  `;

        return html`
            <div class="header">
                <div class="title">My List</div>
                <div class="add" @click=${this.handleAddClick}>
                    <img src="./assets/plus.png" />
                    <span>Add Item</span>
                </div>
            </div>
            <div class="list">
                ${tasks}
            </div>
        `;
    }

    private handleAddClick(e: any): void {
        // Add an item
    }

    private handleItemClick(e: any): void {
        if (this._selected) {
            this._selected.classList.remove('selected');
        }
        this._selected = e.target;
        this._selected.classList.add('selected');

        const item = CatalogData.getByTaskData(e.target.dataContext);
        NavigationService.navigate(ItemDetailsView, item);
    }

    private async loadData(createList = false): Promise<void> {
        this._loading = true;
        const p = Providers.globalProvider;
        if (p.state === ProviderState.SignedIn) {
            // get tasks
            const client = p.graph;
            const lists = await client
                .api('me/todo/lists')
                .version('beta')
                .get();

            const listName = 'Shopping List';

            let list = lists.value.find((f: { displayName: string }) => f.displayName === listName);
            if (!list && createList) {
                list = await client
                    .api('me/todo/lists')
                    .version('beta')
                    .post({
                        displayName: listName,
                    });

                if (list) {
                    // populate with "real" shopping list
                    const items = [
                        'Banana',
                        'Bagel',
                        'Butter',
                        'Crouton',
                        'Cheese',
                        'Grapefruit',
                        'Greek Yogurt',
                        'Green Onion',
                        'Hummus',
                        'KitKat',
                        'Lemon',
                        'Mandarin',
                        'Onion',
                        'Plates',
                        'Red Pepper',
                        'Sour Cream',
                        'Strawberry',
                    ].reverse();
                    for (const item of items) {
                        await client
                            .api(`me/todo/lists/${list.id}/tasks`)
                            .version('beta')
                            .post({ title: item });
                    }
                }
            }
            this._taskListId = list.id;
        }
        this._loading = false;
        this.requestUpdate();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onTemplateRendered(e: any): void {
        const dataContext: any = e.detail.context;
        const element = e.detail.element;

        const taskTemplate = new ListTask();
        taskTemplate.dataContext = dataContext;

        element.appendChild(taskTemplate);
        element.addEventListener('click', (ev: MouseEvent) => this.handleItemClick(ev));
    }
}
