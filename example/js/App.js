import Rutile from '../../es/index.js';
import Main from './components/Main.js';
import Nav from './components/Nav.js';
import NewFunction from './components/NewFunction.js';
import MyName from './components/MyName.js';

const App = () => {
    return Rutile.build(`
        ${Nav()}
        ${Main()}
        ${NewFunction()}
        ${MyName()}
    `);
};

Rutile.render(App(), document.getElementById('root'));
