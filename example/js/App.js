import renderUtil from '../../render-util/index.js'
import Main from './components/Main.js'
import Nav from './components/Nav.js';

const App = () => {
    return renderUtil.build(`
        ${Nav()}
        ${Main()}
    `)
}

renderUtil.render(App(), document.getElementById('root'));