import { BaseView } from '../components/views/BaseView';
import { ViewHost } from '../components/view-host';

class NavigationState {
    public readonly viewType: new () => BaseView;
    public readonly parameter: object;

    constructor(viewType: new () => BaseView, parameter: object) {
        this.viewType = viewType;
        this.parameter = parameter;
    }
}

export class NavigationService {
    private static _rootViewHost: ViewHost;
    private static _navigationStack: Array<NavigationState> = new Array<NavigationState>();

    /**
     * sets the root host for facilitating navigation.
     * @static
     * @param {ViewHost} viewHost
     * @memberof NavigationService
     */
    public static setRootViewHost(viewHost: ViewHost): void {
        this._rootViewHost = viewHost;
    }

    /**
     * updates the current view at the specified position.
     * @param position
     * @param viewType
     * @param parameter
     */
    public static navigate<T extends BaseView>(
        viewType: new () => T,
        parameter?: object,
    ): void {
        // Unload previous view
        const previousView = this._rootViewHost.currentView;
        previousView?.unload();

        // New up an instance of the viewType
        const currentView = new viewType();

        // Navigate the view host
        this._rootViewHost.navigate(currentView);

        // Load the new view
        currentView.load(parameter);

        // Update the backstack
        this._navigationStack.push(new NavigationState(viewType, parameter));
    }

    /**
     * unloads the current view and reloads the previous.
     * @param position
     */
    public static goBack(): void {
        if (this.canGoBack()) {
            // Unload previous view
            const currentView = this._rootViewHost.currentView;
            if (currentView) {
                currentView.unload();
            }

            // Pop the backstack to get the NavigationState for the previous view.
            this._navigationStack.pop();
            const previousNavState: NavigationState = this._navigationStack[this._navigationStack.length - 1];

            // New up an instance of the previous viewType
            const previousView: BaseView = new previousNavState.viewType();

            // Load the previous view
            this._rootViewHost.navigate(previousView);

            // Load the previous view
            previousView.load(previousNavState.parameter);
        }
    }

    /**
     * indicates whether there is a valid back stack to navigate to.
     * @param position
     */
    public static canGoBack(): boolean {
        return this._navigationStack.length > 1;
    }

    /**
     * Run load against the current view using the existing parameter.
     */
    public static reload(): void {
        const view = this._rootViewHost.currentView;
        const parameter = this._navigationStack[this._navigationStack.length - 1];
        view?.load(parameter);
    }

    /**
     * Unload the current view.
     */
    public static unload(): void {
        const view = this._rootViewHost.currentView
        view?.unload();
    }
}
