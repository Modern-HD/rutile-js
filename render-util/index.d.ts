declare namespace RenderUtil {

    export interface RenderUtil {
        render: (html: string, root: HTMLElement, renderOptions?: RenderOptions) => void;
        build: (html: string, buildOptions?: BuildOptions) => string;
        domRef: <T extends Element>() => DomRef<T>;
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

    export type CSSOptions = Partial<CSSStyleDeclaration>;
}