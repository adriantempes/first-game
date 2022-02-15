import BlockScript from './BlockScript';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ObjectManager extends cc.Component {
    @property(cc.Prefab)
    cubePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    targetPrefab: cc.Prefab = null;

    cubePool: cc.NodePool = null;

     
    createCube(num) {
        let cube = null;
        if (this.cubePool.size() > 0) {
            cube = this.cubePool.get(this);
        } else {
            cube = cc.instantiate(this.cubePrefab);
        }
        // cube.getComponent(BlockScript).reuse(this);

        cube.getComponent(BlockScript).setNum(num);

        return cube;
    }



    start () {

    }

    // update (dt) {}
}
