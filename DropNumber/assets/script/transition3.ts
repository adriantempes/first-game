
const {ccclass, property} = cc._decorator;

@ccclass
export default class transition3 extends cc.Component {

   
    onLoad(){
        cc.game.addPersistRootNode(this.node);

    }

    Next_Screen(){
       this.Load_Scene();

    }
    Load_Scene(){
        cc.director.loadScene("begin")
    }
}