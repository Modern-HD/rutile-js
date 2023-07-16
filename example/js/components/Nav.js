import Rutile from '../../../rutile-js/index.js'

export default function Nav() {

    /** @type {Rutile.CSSOptions} */
    const navStyle = {
        padding: '5px',
        width: '100%',
        backgroundColor: '#4285f4',
        fontWeight: 'bold',
        color: 'white',
        fontSize: '1.5em'
    }

    return Rutile.build(`
        <nav style="{navStyle}">
            내비
        </nav>
    `, {
        stylePrepare: {
            /** StylePrepare 기능으로 css 옵션을 객체로 넣을 수 있다. */
            navStyle: navStyle
        }
    })
}