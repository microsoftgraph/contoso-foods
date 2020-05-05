// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ListView, SplashView, ViewHost } from './components';
import { NavigationService } from './services/NavigationService';
// import { MsalProvider } from './providers/MsalProvider';
import { Providers } from '@microsoft/mgt/dist/es6/Providers';
import { LoginType, ProviderState, MsalProvider } from '@microsoft/mgt/dist/es6/providers/providers';

export class App {
    /**
     * Initialize the application
     */
    public async initializeAsync(): Promise<void> {
        // Set the root view host
        await this.initViewHostAsync();

        // Show splash view while loading state
        NavigationService.navigate(SplashView);

        // Initialize the global auth provider.
        // The stateChanged event will trigger a navigation.
        this.initGlobalProvider();
    }

    private onProviderStateChanged(): void {
        NavigationService.navigate(ListView);
    }

    private initGlobalProvider(): void {
        Providers.globalProvider = new MsalProvider({
            clientId: '464c288d-4adf-44a3-8874-142cc1a9ac1a',
            scopes: ['User.Read', 'Tasks.Read', 'Tasks.ReadWrite'],
            loginType: LoginType.Popup,
        });
        Providers.globalProvider.onStateChanged(() => this.onProviderStateChanged());

        if (Providers.globalProvider.state !== ProviderState.Loading) {
            this.onProviderStateChanged();
        }
    }

    private async initViewHostAsync(): Promise<void> {
        const viewHost = new ViewHost();
        const wrapper = document.querySelector('.wrapper');
        wrapper.appendChild(viewHost);
        NavigationService.setRootViewHost(viewHost);
        await viewHost.updateComplete;
    }
}
