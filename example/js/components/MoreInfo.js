import Rutile from "../../../rutile-js/index.js";

/**
 * @param {number} count
 * @param {Function} onIncrement
 * @returns {string}
 */
export default function MoreInfo({count, onIncrement}) {

    return Rutile.build(`
        <div>
            저는 MoreInfo 컴포넌트 입니다.
            <p>
                상태 상속도 받을 수 있습니다.
                카운트2: ${count} <button onClick="{onIncrement}">+1</button>
            </p>
        </div>
    `, {
        funcPrepare: {
            onIncrement
        }
    })
}