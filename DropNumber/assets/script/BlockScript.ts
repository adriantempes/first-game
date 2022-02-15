
import GameManager from './GameManager';




const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockScript extends cc.Component {
  @property(cc.Node)
  blockNode: cc.Node = null;

    @property(cc.Label)
    
    num: cc.Label = null;
    @property([cc.SpriteFrame])
    cubeArray: cc.SpriteFrame

    
    @property(cc.Sprite)
    spBlock:cc.Sprite = null;
    gameManager : GameManager = null
  static numofColumns: any;
  static numofLines: any;
  number:number;
  index : number;
  

 
  onLoad() {
    // this.setValue(2);
  }
  removeCube() {
    this.node.active = false;
    // this.node.destroy();
    
    // this.gameManager.Pool1.put(this.node);
}
//   removeCube() {
    // this.blockNode.active = false;
//     this.gameManager.Pool1.put(this.node);
// }



  setValue(num:number)
  {

      this.num.string = num.toString(); 
      
    
      

      
      
  }
 
  setNum(num, idx){
    this.number = num;
    this.index = idx;
    let cubeSprite = this.node.getComponent(cc.Sprite);
    switch (num) {
      case 2:{
        this.spBlock.spriteFrame = this.cubeArray[0]
        // cubeSprite.spriteFrame = this.cubeArray[0];
        this.setValue(2);
      }
      break;
      case 4:{
        this.spBlock.spriteFrame = this.cubeArray[1]
        // cubeSprite.spriteFrame = this.cubeArray[1];
        this.setValue(4)
      }
      break;
      case 8:{
        this.spBlock.spriteFrame = this.cubeArray[2]
        // cubeSprite = this.cubeArray[2];
        this.setValue(8)
      }
      break;
      case 16:{
        this.spBlock.spriteFrame = this.cubeArray[3]
        // cubeSprite = this.cubeArray[3];
        this.setValue(16)
      }
      break;
      case 32:{
        this.spBlock.spriteFrame = this.cubeArray[4]
        // cubeSprite = this.cubeArray[4];
        this.setValue(32)
      }
      break;
      case 64:{
        this.spBlock.spriteFrame = this.cubeArray[5]
        // cubeSprite = this.cubeArray[5];
        this.setValue(64)
      }
      break;
      case 128:{
        this.spBlock.spriteFrame = this.cubeArray[6]
        // cubeSprite = this.cubeArray[6];
        this.setValue(128)
      }
      break;
      case 256:{
        this.spBlock.spriteFrame = this.cubeArray[7]
        // cubeSprite = this.cubeArray[7];
        this.setValue(256)
      }
      break;
      case 512:{
        this.spBlock.spriteFrame = this.cubeArray[8]
        // cubeSprite = this.cubeArray[8];
        this.setValue(512)
      }
      break;
      case 1024:{
        cubeSprite = this.cubeArray[9];
        this.setValue(1024)
      }
      break;
      case 2048:{
        cubeSprite = this.cubeArray[0];
        this.setValue(2048)
      }
      break;
      case 4096:{
        cubeSprite = this.cubeArray[0];
        this.setValue(4096)
      }
      break;
      case 8192:{
        cubeSprite = this.cubeArray[0];
        this.setValue(8192)
      }
      break;
      case 16384:{
        cubeSprite = this.cubeArray[0];
        this.setValue(16384)
      }
      break;
      default:
        break;
    }

  }

}
