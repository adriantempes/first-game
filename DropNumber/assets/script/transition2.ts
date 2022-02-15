
const {ccclass, property} = cc._decorator;

@ccclass
export default class transition2 extends cc.Component {

   
    onLoad(){
        cc.game.addPersistRootNode(this.node);

    }

    Next_Screen(){
        cc.tween(this.node)
        .to(1,{position: cc.v3(640,360,0)}, {easing : 'cubicInOut'})
        .call(() =>{this.Load_Scene();})
        .to(1,{position: cc.v3(-640,360,0)}, {easing : 'cubicInOut'})
        .start

    }
    Load_Scene(){
        cc.director.loadScene("endgame")
    }

  
}

