import RenderUtil from "../../../render-util/index.js";

const nameAtom = RenderUtil.createGlobalState({
    key: 'name',
    default: 'kim'
});

// const duplicateNameAtom = RenderUtil.createGlobalState({
//     key: 'name', // DuplicateKeyError, 중복된 키는 사용할 수 없다.
//     default: 'kim'
// });

export default nameAtom;