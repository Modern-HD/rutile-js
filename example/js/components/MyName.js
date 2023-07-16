import Rutile from "../../../rutile-js/index.js";
import nameAtom from "../atom/nameAtom.js";

export default function MyName() {
    const name = Rutile.getGlobalState(nameAtom);

    return Rutile.build(`
        <div>
            다른 컴포넌트
        </div>
        <div>
            내 이름은? ${name.subs()}
        </div>
    `)
}