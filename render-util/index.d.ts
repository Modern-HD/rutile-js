declare namespace RenderUtil {

    export interface RenderUtil {
        render: (html: string, root: HTMLElement, renderOptions?: RenderOptions) => void;
        build: (html: string, buildOptions?: BuildOptions) => string;
        domRef: <T extends Element>() => DomRef<T>;
        createState: <T>(initialState: T) => [StateObj<T>, (newVal: T) => void];
    }

    export interface BuildOptions {
        funcPrepare?: {[key: string]: Function};
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
        subsList: {elem: HTMLElement, rendered?: boolean, callback?: Function, component?: boolean}[];
        callbackMap: Map<string, Function>;
    }

    export type CSSOptions = Partial<CSSStyleDeclaration>;
    export type StateSubsMap = Map<string, State>
    export type StateObj<T> = { subs: Subs<T>, getState: () => T};
    export type Subs<T> = (type?: 'inline' | 'block' | 'component' | SubsCallback<T>, callback?: SubsCallback<T>) => string;
    type SubsCallback<T> = (state: T) => number | string;
}