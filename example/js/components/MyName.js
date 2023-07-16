import renderUtil from "../../../render-util/index.js";
import nameAtom from "../atom/nameAtom.js";

export default function MyName() {
    const name = renderUtil.getGlobalState(nameAtom);

    return renderUtil.build(`
        <div>
            다른 컴포넌트
        </div>
        <div>
            내 이름은? ${name.subs()}
        </div>
    `)
}