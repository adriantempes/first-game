// import nodeso from "./nodeso";

import BlockScript from './BlockScript';
import transition from './transition';
import transition2 from './transition2';
















var SIZE = { x: 130, y: 130 };
var COL = 5;
var ROW = 6;
var BASESIZE = 130;
var DROPSPEED = 6000;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  public static instance: GameManager;
  @property(cc.Prefab)
  nodeso: cc.Prefab = null;
  Pool1: cc.NodePool = null;
  @property(cc.Node)



  touchNode: cc.Node = null;
  TouchArea: cc.Node = null;


  position: cc.Vec3;
  rowCurrent: number = ROW;
  columnCurrent: number = Math.ceil(COL / 2);
  columnTouchNew: number = Math.ceil(COL / 2);
  board: any[];
  needMerge: any[];
  isCanTouch: boolean = true;
  block: any[];
  mergeNumers: any[];
  mergeCount: any[];
  nowNum: any;
  downNumbers: any[];
  downCount: number;
  maxIdxCheck: number = 0;
  continue: boolean;
  keep: boolean;
  isLocked: boolean = true

  nextNum: number;
  checkCount: number;

  isBlockingToolRow: boolean = false;
  // @property(cc.Node)
  // playBoardArea: cc.Node = null;
  nowPic = null;
  comboCount: number;

  onLoad() {

    cc.game.addPersistRootNode(this.node);
    this.onInitBlock();
    let _this = this;
    GameManager.instance = this;
    this.init();
    this.Pool1 = new cc.NodePool();
    for (let i = 0; i < 4; i++) {
      let enemy = cc.instantiate(this.nodeso);
      this.Pool1.put(enemy);
    }
    let self = this;





    this.currenBlock = this.spawn(2, 5);

    // this.spawn(0, 0);
    console.log(
      "hehe 1",
      this.currenBlock.position.x,
      this.currenBlock.position.y
    );

    this.touchNode.on(cc.Node.EventType.TOUCH_START, (event) => {
      if (!this.isCanTouch) return;
      let mouse_pos = this.touchNode.convertToNodeSpaceAR(event.getLocation()); //toa do tro chuot
      let board_idx = this.convertPosToIndex(mouse_pos); // chuyen toa do tro chuot qua cot va hang
      let nodeso_pos = this.convert(board_idx.col, 5); //chuyen toa do cot va hang thanh toa do nodeso


      this.currenBlock.setPosition(nodeso_pos);

    }, this);
    this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
      
      // let mouse_pos = event.getLocation();
      // this.currenBlock.setPosition(mouse_pos);
      if (!this.isCanTouch) return;
      let mouse_pos = this.touchNode.convertToNodeSpaceAR(event.getLocation()); //toa do tro chuot
      let board_idx = this.convertPosToIndex(mouse_pos); // chuyen toa do tro chuot qua cot va hang
      let nodeso_pos = this.convert(board_idx.col, 5); //chuyen toa do cot va hang thanh toa do nodeso

      // console.log(
      //   "mouse_pos",
      //   mouse_pos.x,
      //   mouse_pos.y,
      //   "mouse moving",
      //   board_idx.col,
      //   board_idx.line
      // );
      this.currenBlock.setPosition(nodeso_pos);
    }, this);
    this.touchNode.on(cc.Node.EventType.TOUCH_END, (_event) => {
      if (!this.isCanTouch) return;
      var blockscript = _this.block;
      var num = parseInt(_this.currenBlock.getComponent(BlockScript).num.string)
      // blockscript[27] = _this.currenBlock;
      // blockscript[27].num = parseInt(_this.currenBlock.getComponent(BlockScript).num.string)
      // var i : number
      // var j : number
      // var idx = _this.idx(i,j)
      this.isCanTouch = false;
      var B = _this.convertPosToIndex(_this.currenBlock.position)
      var col = B.col;
      for (let j = 0; j < 6; j++) {

        if (_this.board[col][j] == null) {
          _this.drop(_this.currenBlock, col, j);
          break;

        }
        if (_this.board[col][4] != null && num != blockscript[col + 4 * COL].num) {
          this.Load_Scene();
        }

      }
    //  this.currenBlock = this.spawn(2,5)

    //




    }, this);


  }



  Load_Scene() {
    cc.director.loadScene("endgame");
  }





  merge(idx, callback) {

    var blockscript = this.block;





    if (blockscript[idx].num == 0) {
      //Đáng lẽ nó phải được hợp nhất bởi những diem khác.

      callback(-100);
      return;

    }
    // blockscript[idx].pic = new cc.Node

    var mergeNumers = this.mergeNumers;
    var mergeDatas = mergeNumers[idx];
    var mergeCount = this.mergeCount;
    // var blockscript = this.block;



    mergeCount[idx] = mergeDatas.length;




    var _this = this;
    var mergeNum = blockscript[idx].num * Math.pow(2, mergeDatas.length - 1);

    for (var i = 0; i < mergeDatas.length; i++) {
      var subIdx = mergeDatas[i];

      var action = null;
      if (subIdx != idx) { //Khối tổng hợp nhấp nháy và biến mất.
        blockscript[subIdx].num = 0;
        (function (subIdx) {
          action = cc.sequence(

            // cc.fadeTo(0.1, 128),
            // cc.fadeTo(0.1, 255),
            cc.moveTo(0.05, _this.getBlockPosition(idx)).easing(cc.easeSineIn()),
            cc.callFunc(function () {

              //TODO show anim remove




              // blockscript[subIdx].pic.getComponent(BlockScript).removeCube();





              _this.removeCubefromBoard(subIdx)
              blockscript[subIdx].pic.removeFromParent(true);
              // blockscript[subIdx].pic.active = false

              blockscript[subIdx] = { num: 0, pic: null };
              // blockscript[subIdx] = {num: 0, pic: null};
              mergeCount[idx] = mergeCount[idx] - 1;
              // block[subIdx].pic.getComponent("cubecomponent").removeCube();
              // blockscript[subIdx].pic.getComponent(BlockScript).removeCube();



              if (mergeCount[idx] == 0) {
                callback(-100);
              }
            })
          );
        })(subIdx);
      } else { //Khối tổng hợp sẽ nhấp nháy, sau đó trở thành một khối mới và phóng to lại.
        (function (subIdx) {
          action = cc.sequence(

            cc.fadeTo(0.05, 128),
            cc.fadeTo(0.05, 255),
            cc.callFunc(function () {

              // blockscript[subIdx].pic.active = false
              blockscript[subIdx].pic.removeFromParent(true)
              _this.removeCubefromBoard[subIdx]
              blockscript[subIdx].num = mergeNum;

              blockscript[subIdx].pic = _this.createMergeBlock(mergeNum, subIdx);
              blockscript[subIdx].pic.runAction(cc.sequence(
                cc.callFunc(function () {



                }),
                cc.scaleTo(0.03, 2),
                cc.scaleTo(0.05, 1),
                cc.callFunc(function () {

                  mergeCount[idx] = mergeCount[idx] - 1;

                  if (mergeCount[idx] == 0) {
                    callback(mergeNum);
                  }
                })
              ));
            })
          );

        })(subIdx);
      }

      blockscript[subIdx].pic.runAction(action);


    }
  }
  removeCubeWithIdx(idx) {
    let cube = this.block[idx].pic;

    if (cube != null) {
      cube.getComponent(BlockScript).removeCube();
    }
    this.block[idx] = { num: 0, pic: null };
  }
  removeCubefromBoard(idx) {
    // let cube = this.block[idx].pic
    let cube = this.block[idx].pic;
    var position = this.pos(idx);
    if (cube != null) {
      return this.board[position.x][position.y] = null;
    }
    this.block[idx] = { num: 0, pic: null };



  }





  // removeCube(a : cc.Node) {
  //   a.active = false;
  //   this.Pool1.put(a);
  // }
  createMergeBlock(mergeNum, subIdx) {
    let mergeBlock = this.CreateCube(mergeNum);
    mergeBlock.getComponent(BlockScript).setNum(mergeNum, subIdx);
    // this.movingCube.getComponent("CubeComponent").isTarget = true;
    this.touchNode.addChild(mergeBlock);

    let pos = this.getBlockPosition(subIdx);
    mergeBlock.setPosition(this.convert(pos.x + 0.01, pos.y - 0.05));
    console.log("vi tri la" + pos);


    return mergeBlock;
  }
  onInitBlock() {

    var blockscript = this.block

    if (blockscript != null) {
      for (var i = 0; i < ROW * COL; i++) {
        blockscript[i].num = 0
      }
    } else {
      blockscript = this.block = new Array();
      for (var i = 0; i < ROW * COL; i++) {
        blockscript[i] = { num: 0, pic: null };


      }



    }
  }

  sortAfterMerge() {
    var blockscript = this.block;
    var needMerge = this.needMerge;
    if (!this.needMerge) return;
    var downNumbers = this.downNumbers = [];
    for (var col = 0; col < COL; col++) {
      var blank = false;
      //Binh change from row <= Row to Row
      for (var row = 0; row < ROW; row++) {
        var idx = this.idx(col, row);
        //99 is stone
        if (blockscript[idx].num == 0) {
          blank = true;

        } else if (blank && blockscript[idx] != 0) {
          //Check if stone not down it
          downNumbers.push(idx);
        }
      }
    }
    var addCheckNumbers = [];
    for (var i = 0; i < needMerge.length; i++) {
      var has = false;
      for (var k in downNumbers) {
        if (downNumbers[k] == needMerge[i]) {
          has = true;
          break;
        }
      }
      if (!has) {
        addCheckNumbers.push(needMerge[i]);
      }
    }
    var downNumbersCount = downNumbers.length;
    if (downNumbersCount == 0) {
      this.checkMerge(needMerge
      )
      return

    }
    this.downCount = downNumbersCount;
    var _this = this;
    for (var i = 0; i < downNumbersCount; i++) {
      let idx = downNumbers[i];

      let downIdx = idx - COL;
      if (idx > this.maxIdxCheck) {
        this.maxIdxCheck = idx;
      }

      while (downIdx - COL > 0) {
        if (blockscript[downIdx - COL].num == 0) {
          downIdx = downIdx - COL;
        }
        else {
          break;

        }
      }


      blockscript[downIdx].num = blockscript[idx].num;
      blockscript[downIdx].pic = blockscript[idx].pic;
      downNumbers[i] = downIdx
      var downPos = this.pos(downIdx);
      var oldPos = this.pos(idx);
      _this.board[downPos.x][downPos.y] = _this.board[oldPos.x][oldPos.y];
      _this.board[oldPos.x][oldPos.y] = null;



      blockscript[idx] = { num: 0, pic: null };
      let action = cc.sequence(
        cc.moveBy(0.05, cc.v2(0, -BASESIZE * (idx - downIdx) / COL)).easing(cc.easeIn(3)),
        cc.callFunc(function () {
          _this.downCount = _this.downCount - 1;
          if (_this.downCount == 0) {
            for (let j = 0; j < addCheckNumbers.length; j++) {
              //TODO // Lỗi nghiêm trọng, được lặp lại. Gxj đã nêu ra.
              let downHas = false;
              for (let k = 0; k < downNumbers.length; k++) {
                if (downNumbers[k] == addCheckNumbers[j]) {
                  downHas = true;
                  break;
                }
              }
              if (!downHas) {
                downNumbers.push(addCheckNumbers[j]);
              }
            }
            _this.checkMerge(downNumbers.reverse());


            // blockscript[downIdx].pic = _this.board[a.x][a.y];
            //  _this.board[b.x][b.y] = null;

          }

        }

        ));

      blockscript[downIdx].pic.runAction(action);

    }

  }






  CheckAround(mergeIdx, idx) {
    var i: number

    var mergeDatas = this.mergeNumers[mergeIdx];
    for (var k in mergeDatas) {
      if (mergeDatas[k] == idx) {

        return;
      }
    }
    mergeDatas.push(idx);
    var pos = this.pos(idx);
    var x = pos.x
    var y = pos.y
    // var blockscript = this.currenBlock.getComponent(BlockScript)
    var blockscript = this.block
    //   blockscript[i] = this.currenBlock
    // blockscript[i].num = parseInt(this.currenBlock.getComponent(BlockScript).num.string)
    var num = blockscript[idx].num
    if (x > 0) { //left
      if (blockscript[this.idx(x - 1, y)].num == num) {
        //console.log("same left..")
        this.CheckAround(mergeIdx, this.idx(x - 1, y));
      }
    }
    if (x < COL - 1) {  //right
      if (blockscript[this.idx(x + 1, y)].num == num) {
        //console.log("same right..")
        this.CheckAround(mergeIdx, this.idx(x + 1, y));
      }
    }
    if (y < ROW - 1) {  //up
      if (blockscript[this.idx(x, y + 1)].num == num) {
        //console.log("same up..")
        this.CheckAround(mergeIdx, this.idx(x, y + 1));
      }
    }
    if (y > 0) {  //down
      if (blockscript[this.idx(x, y - 1)].num == num) {
        //console.log("same down..")
        this.CheckAround(mergeIdx, this.idx(x, y - 1));
      }
    }
    return true
    // for (let a = 0; a < around.length; a++) {
    //       let _i = i + around[a].i;
    //       let _j = j + around[a].j;
    //       if(this.board[_i][_j] === null) continue;
    //       let nearBlock = this.board[_i][_j].getComponent(BlockScript);
    //       if (blockscript.num === nearBlock.num) {

    //       } else {

    //       }
    //     }
  }




  checkMerge(idxes, keep?) {

    // this.onInitBlock()
    var a = this.pos(idxes)
    var idx = this.idx(a.x, a.y)




    // var idx = this.idx(i,j)
    var b = parseInt(this.currenBlock.getComponent(BlockScript).num.string)
    // var num = blockscript[idx].num
    var mergeNumers = this.mergeNumers = [];
    this.mergeCount = []
    var needMerge = this.needMerge = []; //需要合成的点 nhung diem can tong hop
    for (var i = 0; i < idxes.length; i++) {
      idx = idxes[i];
      if (b != 0) {
        mergeNumers[idx] = []; //检查点上的相邻相同数Các số giống hệt nhau liền kề trên các trạm kiểm soát
        this.CheckAround(idx, idx);

        if (mergeNumers[idx].length >= 2) {
          needMerge.push(idx);
          keep = true
          //  this.continue = true;
        }
      }
    }
    var needMergeCount = needMerge.length;

    this.checkCount = needMergeCount;
    var _this = this;
    for (var i = 0; i < needMergeCount; i++) {
      this.merge(needMerge[i], function (mergeNumber) {

        console.log("Merge number" + mergeNumber);
        _this.checkCount = _this.checkCount - 1;

        if (_this.checkCount == 0) {
          _this.sortAfterMerge();

        }
      })

    }

  }
  CreateCube(num) {
    let cube = null;
    if (this.Pool1.size() > 0) {
      cube = this.Pool1.get(this);

    } else {
      cube = cc.instantiate(this.nodeso);
    }
    cube.getComponent(BlockScript).setNum(num);

    return cube

  }





  getMovingIndex() {
    return this.nowPic.getComponent("CubeComponent").getIdx();
  }
  idx(x, y) {
    // var COL = 5
    return (y) * COL + x; //Mang so
  }
  pos(idx) {
    //day la ham cv
    var y = Math.ceil((idx + 1) / COL) - 1;
    var x = idx - (y) * COL;
    return cc.v2(x, y);
  }

  getBlockPosition(idx) {
    var pos = this.pos(idx);
    this.convert(pos.x, pos.y)

    return cc.v2(pos.x, pos.y)
  }


  init() {
    let numofColumns = 5;
    let numofLines = 6;
    this.board = [];
    for (var i = 0; i < numofColumns; i++) {
      let col = [];
      for (var j = 0; j < numofLines; j++) {
        let block = null;
        col.push(block);

      }
      this.board.push(col);
    }

    console.log("initboard", this.board);
  }

  convert(col: number, line: number) {
    var _pos = cc.v2(col * SIZE.x + SIZE.x / 2, line * SIZE.y + SIZE.y / 2 + 10);
    return _pos;

  }

  convertPosToIndex(pos: cc.Vec3) {
    let col: number;
    let line: number;
    pos.z = 0;
    col = Math.floor(pos.x / BASESIZE);
    if (col < 0) {
      col = 0
    }
    if (col > 4) {
      col = 4
    }
    line = Math.floor(pos.y / BASESIZE)
    if (line < 0) {
      line = 0
    }
    if (line > 5) {
      line = 5
    }

    console.log("pos =", col, line, Math.round(pos.x), Math.round(pos.y));


    return { col, line };
  }

  currenBlock: cc.Node = null;
  B: cc.Node = null;
  spawn(colum: number, line: number) {

    // var colum = 2;
    // var line = 5;
    console.log("hehe 0");
    let enemy: cc.Node = null;

    if (this.Pool1.size() > 0) {
      enemy = this.Pool1.get();
    } else {
      enemy = cc.instantiate(this.nodeso);
    }

    enemy.parent = this.touchNode;

    enemy.getComponent(BlockScript).setNum(this.getRand(), 27);


    enemy.setPosition(this.convert(colum, line));



    return enemy;
  }



  getRand() {
    let rand = Math.random();
    if (rand < 0.2) {
      return 2;
    } else if (0.2 <= rand && rand <= 0.4) {
      return 4;
    }
    else if( 0.4 <= rand&&rand < 0.7 ){
      return 8;
    }
    else if (0.7 <= rand&&rand < 0.8){
      return 16
    }
    else if (0.8 <= rand&&rand < 0.9){
      return 32
    }
    else if (0.9 <= rand&&rand < 1){
      return 64
    }
    // else if (0.96 <= rand&&rand < 1){
    //   return 128
    // }

  }



  drop(currentblock: cc.Node, i, j) {
    console.log("drop xuong hang", j);
    let midle_column = 2;
    let highest_line = 5;
    let _this = this;
    var idx = this.idx(i, j)



    let blockdrop =  cc.tween()
      .to(0.1, { position: new cc.Vec3(currentblock.position.x, j * 130 + 130 / 2) })
      .call(function () {

        _this.board[i][j] = currentblock;

        _this.block[idx].num = parseInt(currentblock.getComponent(BlockScript).num.string)

        _this.block[idx].pic = _this.currenBlock

        _this.checkMerge([idx]);
        // _this.currenBlock = _this.spawn(midle_column, highest_line);
        _this.isCanTouch = true
      })
    let newblock = cc.tween().call(function () {
          _this.currenBlock = _this.spawn(midle_column, highest_line);
        })
      cc.tween(currentblock).then(blockdrop).then(newblock)
      .start();
     

   
  }
 
}


