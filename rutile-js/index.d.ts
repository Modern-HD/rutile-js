declare namespace Rutile {

    export interface Rutile {
        render: (html: string, root: HTMLElement, renderOptions?: RenderOptions) => void;
        build: (html: string, buildOptions?: BuildOptions) => string;
        domRef: <T extends Element>() => DomRef<T>;
        createState: <T>(initialState: T) => [StateObj<T>, Dispatch<T>];
        createGlobalState: <T>(option: GlobalStateInit<T>) => Atom<T>;
        getGlobalState: <T>(atom: Atom<T>) => StateObj<T>;
        setGlobalState: <T>(atom: Atom<T>) => Dispatch<T>;
        useGlobalState: <T>(atom: Atom<T>) => [StateObj<T>, Dispatch<T>];
        resetGlobalState: <T>(atom: Atom<T>) => void;
    }

    export interface BuildOptions {
        eventPrepare?: {[key: string]: Function};
        stylePrepare?: {[key: string]: CSSOptions};
        domReady?: Function | Array<Function>
    }

    /**
     * @property append -- root안의 내용을 비우지 않고 렌더링, 기본값 false
     */
    export interface RenderOptions {
        append?: boolean;
    }

    export interface DomRef<T extends Element> {
        current: T | null;
        set: string;
    }

    export interface State {
        value: any;
        subsList: {elem: HTMLElement, callback?: Function, component?: boolean}[];
        callbackMap: Map<string, Function>;
        default?: any;
    }

    export interface GlobalStateInit<T> {
        key: string;
        default: T;
    }

    export interface Atom<T> {
        stateKey: string;
        defaultValue: T;
    }

    export type CSSOptions = Partial<CSSStyleDeclaration>;
    export type StateMap = Map<string, State>;
    export type StateObj<T> = { subs: Subs<T>, getState: () => T};
    export type Dispatch<T> = (newVal: T) => void;
    export type Subs<T> = (type?: 'inline' | 'block' | 'component' | SubsCallback<T>, callback?: SubsCallback<T>) => string;
    type SubsCallback<T> = (state: T) => number | string;
}