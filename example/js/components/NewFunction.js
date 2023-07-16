import renderUtil from "../../../render-util/index.js";
import MoreInfo from "./MoreInfo.js";
import nameAtom from "../atom/nameAtom.js";

export default function NewFunction() {

    const [count, setCount] = renderUtil.createState(0);
    const [myObj, setMyObj] = renderUtil.createState({ count: 0 });
    const [infoOpen, setInfoOpen] = renderUtil.createState(false);
    const setName = renderUtil.setGlobalState(nameAtom);

    /** @type {RenderUtil.CSSOptions} */
    const paragraphStyle = {
        marginTop: '0px',
        marginBottom: '2px',
    }

    const onIncrement = () => { setCount(count.getState() + 1) };
    /** @type {RenderUtil.DomRef<HTMLInputElement>} */
    const nameInput = renderUtil.domRef();

    return renderUtil.build(`
        <h3>2023-07 신기능: createState</h3>
        <p>새로운 상태를 만들고, 상태가 바뀌면 그 부분만 재렌더링 된다.</p>
        <div style="margin-bottom: 5px">
            카운터2: ${count.subs()}
            <button onClick="{onIncrement}">+1</button>
        </div>
        <p>
            <p style="{paragraphStyle}">
                <p style="{paragraphStyle}">객체의 경우에는 프로퍼티를 꺼낼 때 callback을 이용한다.</p>
                <p style="{paragraphStyle}">카운터3: ${myObj.subs(s => s.count)} <button onClick="{onMyObjIncrement}">+1</button></p>
                <p style="{paragraphStyle}">카운터3 + 5: ${myObj.subs(s => s.count + 5)}</p>
            </p>
        </p>
        <h4 style="margin-bottom: 2px;">callback을 이용하여 state값 대신 컴포넌트를 로드할 수도 있다.</h4>
        <button onClick="{onToggleInfo}">컴포넌트 ${infoOpen.subs(s => s ? '끄기' : '보기')}</button>
        ${infoOpen.subs('component'
            , openState => count.subs('component'
                // 상태의 값을 상속할 때는 반드시 구독 형태로 넘겨야한다.
                , countState => openState ? MoreInfo({ count: countState, onIncrement}) : '')
        )}
        <h4>globalState 기능</h4>
        <p style="{paragraphStyle}">state가 쓰이는 곳이 많거나, 상속이 어려운 상황이면 globalState 기능을 이용할 수 있다.</p>
        <p>
            <input type="text" ref="${nameInput.set}" placeholder="이름 입력">
            <button onClick="{onRename}">이름 변경</button>
            <button onClick="{onNameReset}">리셋</button>
        </p>
    `, {
        funcPrepare: {
            onIncrement,
            onMyObjIncrement: () => {
                const newObj = myObj.getState();
                newObj.count++;
                setMyObj(newObj);
            },
            onToggleInfo: () => { setInfoOpen(!infoOpen.getState()) },
            onRename: () => { setName(nameInput.current.value) },
            onNameReset: () => { renderUtil.resetGlobalState(nameAtom) }
        },
        stylePrepare: {
            paragraphStyle: paragraphStyle
        }
    })
}