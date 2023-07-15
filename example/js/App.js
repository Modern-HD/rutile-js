import renderUtil from '../../render-util/index.js'
import Main from './components/Main.js'
import Nav from './components/Nav.js';
import NewFunction from './components/NewFunction.js'

const App = () => {
    return renderUtil.build(`
        ${Nav()}
        ${Main()}
        ${NewFunction()}
    `)
}

renderUtil.render(App(), document.getElementById('root'));