// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { html, customElement, TemplateResult, CSSResult, css } from 'lit-element';
import { BaseView } from './BaseView';
import { ShoppingTask } from '../shopping-task';
import { NavigationService } from '../../services/NavigationService';
import { ListView } from './list-view';
import { NavPanel } from '../nav-panel';
import { ProviderState, Providers } from '@microsoft/mgt';

@customElement('shopping-view')
export class ShoppingView extends BaseView {
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
                padding: 20px 12px 4px 12px;
            }

            .header > div {
                display: flex;
                align-items: center;
            }

            .title {
                font-size: var(--title-font-size);
            }

            .edit {
                color: var(--accent-color);
                margin-left: 12px;
                cursor: pointer;
            }

            .list {
                flex-grow: 1;
                overflow: auto;
            }

            mgt-todo {
                --task-complete-background: #ffffff;
                --task-icon-background-completed: var(--accent-color);
                --task-icon-background: #ffffff;
                --task-icon-border-completed: solid 1px var(--accent-color);
                --task-icon-border: solid 1px #000000;
                --task-icon-color: #ffffff;
                --task-icon-color-completed: #ffffff;
                --task-icon-border-radius: 2px;
                --task-icon-alignment: center;
                --task-margin: 0 0 10px 0;
                background-color: transparent;
                padding: 12px 0 0 12px;
            }

            .completed {
                opacity: 0.33;
            }

            .store--value {
                color: var(--accent-color);
                cursor: pointer;
            }
        `;
    }

    private _loading: boolean;
    private _taskFolderId: string;

    constructor() {
        super();
        this.loadData();
    }

    public render(): TemplateResult {
        const tasks =
            this._loading || !this._taskFolderId
                ? null
                : html`
                      <mgt-todo
                          .targetId=${this._taskFolderId}
                          hide-header
                          hide-options
                          @templateRendered=${this.onTemplateRendered}
                      >
                          <template data-type="task-details"></template>
                      </mgt-todo>
                  `;

        return html`
            <div class="header">
                <div>
                    <div class="title">Go Shopping</div>
                    <div class="edit" @click=${this.onEditListClick}>Edit list</div>
                </div>
                <div>
                    <div class="store--image">
                        <img src="./assets/store.png" />
                    </div>
                    <div class="store--title">&nbsp;Store:&nbsp;</div>
                    <div class="store--value">Contoso Foods Central</div>
                </div>
            </div>
            <div class="list">
                ${tasks}
            </div>
        `;
    }

    private async loadData(): Promise<void> {
        this._loading = true;
        const p = Providers.globalProvider;
        if (p.state === ProviderState.SignedIn) {
            // get tasks
            const client = p.graph;
            const folders = await client
                .api('me/outlook/taskFolders')
                .version('beta')
                .select(['id', 'name'])
                .get();

            const folderName = 'Shopping List';
            const folder = folders.value.find((f: { name: string }) => f.name === folderName);
            this._taskFolderId = folder?.id;
        }
        this._loading = false;
        this.requestUpdate();
    }

    private onEditListClick(): void {
        NavigationService.navigate(ListView);
        NavPanel.default.updateSelection(ListView);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onTemplateRendered(e: any): void {
        const dataContext: any = e.detail.context;
        const element = e.detail.element;

        const taskTemplate = new ShoppingTask();
        taskTemplate.dataContext = dataContext;

        if (dataContext.task.status === 'completed') {
            taskTemplate.classList.add('completed');
        }

        element.appendChild(taskTemplate);
    }
}
