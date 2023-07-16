import Rutile from "../../../rutile-js/index.js";

const nameAtom = Rutile.createGlobalState({
    key: 'name',
    default: 'kim'
});

// const duplicateNameAtom = Rutile.createGlobalState({
//     key: 'name', // DuplicateKeyError, 중복된 키는 사용할 수 없다.
//     default: 'kim'
// });

export default nameAtom;