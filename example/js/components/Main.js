import Rutile from '../../../es/index.js';

export default function Main() {
    const countState = {
        value: 0,
    };

    /** @type {Rutile.CSSOptions} */
    const paragraphStyle = {
        marginTop: '0px',
        marginBottom: '2px',
    };

    // DomRef 기능을 통해 이벤트 발생 시에 사용할 DOM 객체를 가져올 수 있다.
    /** @type {Rutile.DomRef<HTMLSpanElement>} */
    const countRef = Rutile.domRef();

    const onIncrement = () => {
        countRef.current.innerText = ++countState.value;
    };

    return Rutile.build(
        `
        <main>
            <p style="{paragraphStyle}">메인 페이지의 내용</p>
            <p style="{paragraphStyle}">onClick 속성을 통해 이벤트 바인딩 가능</p>
            <p>
                카운터:
                <span ref="${countRef.set}">${countState.value}</span>
                <button onClick="{onIncrement}">+1</button>
            </p>
        </main>
    `,
        {
            eventPrepare: {
                onIncrement: onIncrement,
            },
            stylePrepare: {
                paragraphStyle: paragraphStyle,
            },
        }
    );
}
