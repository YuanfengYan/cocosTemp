/**
 *  View界面的管理器 负责打开关闭View 注意：这里说的都是在同一个场景中的View管理
 *  viewOpen 打开的界面是一个放在resources下面的预制体，这个预制体里面的资源使用远程资源
 */

 const ViewCtrl = require('ViewCtrl');
 const ViewLoader = require('ViewLoader');
 const ViewComponent = require('ViewComponent');
 
 module.exports = {
 
     /**
      * @title View界面堆栈
      */
     viewStack: [],
 
     /**
      * @title View界面父节点
      */
     viewNode: null,
 
     /**
      * @title 全局的数据管理（这里的数据会发布给全部的view 请控制自己 不要滥用）
      */
     $store: {scene: null},
 
     /**
      * @title 场景切换（切换的时候，应该将界面堆栈清空）
      * @param {string} sceneName
      * @param {Object} data 切换场景时需要传的参数
      * @param {function} onLaunched 回调函数
      */
     sceneCutTo (sceneName, data = null, onLaunched) {
         this.viewStack = [];
         this.$store.scene = data;
         cc.director.loadScene(sceneName, onLaunched);
     },

     /** 加载界面预制体 */
     _load_view_prefab(prefab,viewName){
        return new Promise((resolve, reject)=>{
            function callback(err,data){
               if(err){
                   reject(err)
               }else{
                   resolve(data)
               }
            }
           ViewLoader.getViewNode(prefab, viewName, callback);
        })
    },
    /** 初始化一个界面控制器 */
    _init_view_ctrl(node ,show, parentNode,data,viewName) {
        return new Promise((resolve, reject)=>{
            const viewNode = node
            const viewCtrl = new ViewCtrl();
            const nodeCtrl = viewNode.getComponent(ViewComponent);
            if (!nodeCtrl) {
                cc.error('nodeCtrl:', nodeCtrl);
                cc.error('viewNode:', viewNode);
                cc.error('ViewComponent:', ViewComponent);
            }
            viewNode.active = show;
            nodeCtrl.$data = data;
            viewNode.name  = viewName;
            viewCtrl.name = viewName;
            viewCtrl.node = viewNode;
            viewCtrl.ctrl = nodeCtrl;
            viewNode._$data = data;
            viewCtrl.zIndex = this.viewStack.length + 1;

            /** 执行加载动画和过场动画 */
            this.viewStack.push(viewCtrl);
            viewCtrl.pushNode(parentNode);
            // viewCtrl.autoExecOpenAction(function () {
            //     return next(null)
            // });

            /** 万事具备 告诉系统界面打开了 */
            if (show) {this.updateViews();}
            viewCtrl.onViewOpen();

            if (typeof cb === "function") {
                return cb(null, viewCtrl);
            }
            resolve()
        })
    },

     /**
      * @title 显示一个view界面
      * @param {cc.Prefab|string} prefab
      * @param {object|string|function|cc.Node} args
      */
     showView (prefab, ...args) {
         let viewName, data = {}, cb, show = true, viewNode;
 
         for (let i = 0; i < args.length; i++) {
             if (typeof args[i] === "function") {
                 cb = args[i];
             } else if (args[i] instanceof cc.Node) {
                 viewNode = args[i];
             } else if (typeof args[i] === "object") {
                 data = args[i];
             } else if (typeof args[i] === "string") {
                 viewName = args[i];
             } else if (typeof args[i] === "boolean") {
                 show = args[i];
             }
         }
         viewName = viewName || `view_${this.viewStack.length + 1}`;
         viewNode = viewNode || this.viewNode || cc.Canvas.instance.node;
         /** 构建打开页面的函数任务（这里用到了js的async函数库，目的是代码清晰） */
        Promise.resolve().then(()=>{
            return this._load_view_prefab(prefab,viewName)//加载界面预制体
        }).then((node)=> {
            return this._init_view_ctrl(node,show,viewNode,data,viewName)//初始化一个界面控制器
        }).catch((err)=>{
            console.log('err', err)
        })
     },
 
     /**
      * @title 将一个view界面从场景中弹出 如果界面设置了缓存参数 则这个节点的资源不会释放，反之全部释放
      * @param {string|cc.Node|function|undefined} args
      */
     popView (...args) {
         let viewCtrl, viewName, cb;
         if (typeof args[0] === "function") {
             cb = args[0];
         } else {
             viewName = args[0];
             cb = args[1];
         }
         cc.core.Utils.debugLog('退出界面：', viewName);
         if (viewName) {
             if (viewName instanceof cc.Node) {
                 for (let index = this.viewStack.length - 1; index >= 0; index--) {
                     if (this.viewStack[index] && this.viewStack[index].node === viewName) {
                         viewCtrl = this.viewStack[index];
                         this.viewStack.splice(index, 1);
                         break;
                     }
                 }
             } else if (typeof viewName === "string") {
                 for (let index = this.viewStack.length - 1; index >= 0; index--) {
                     if (this.viewStack[index] && this.viewStack[index].name === viewName) {
                         viewCtrl = this.viewStack[index];
                         this.viewStack.splice(index, 1);
                         break;
                     }
                 }
             }
             // 找不到这个View
             if (!viewCtrl) {
                 if (typeof cb === 'function') { cb('view ctrl not found'); }
                 return;
             }
         } else {
             viewCtrl = this.viewStack.pop();
         }
 
         // 开始刷新界面的显示隐藏
         this.updateViews();
 
         // 开始执行过场动画
         viewCtrl.autoExecCloseAction(() => {
             // 开始执行view的自定义回调函数
             viewCtrl.onViewClose();
 
             // 弹出这个节点的数据
             viewCtrl.popNode();
 
             // 执行回调
             if (typeof cb === 'function') { cb(null); }
         });
     },
 
     /**
      * @title 像对应的view发送事件 在对应的view里面使用 this.node.on('event_name', ()=>{}) 监听
      */
     emitView (viewName, eventName, params) {
         cc.core.Utils.debugLog('界面通知事件：', viewName, eventName, params);
         if (typeof viewName === "string" && typeof eventName === "string") {
             for (let index = this.viewStack.length - 1; index >= 0; index--) {
                 if (this.viewStack[index] && this.viewStack[index].name === viewName) {
                     this.viewStack[index].node.emit(eventName, params); break;
                 }
             }
         }
     },
 
     /**
      * @title 刷新view的显隐关系（为了获得较好的渲染性能）
      */
     updateViews () {
         // 思路：我们根据目前界面堆栈里面的全部界面，将本页面的以上的界面全部隐藏
         for (let i = (this.viewStack.length - 1); i >= 0; i--) {
             this.viewStack[i].node.active = !(this.viewStack[i + 1] && !this.viewStack[i + 1].ctrl.SubView);
         }
     },
 
     /**
      * @title 获取界面的脚本控制器
      * @param {string|undefined} viewName
      * @return {*}
      */
     getViewCtrlByName (viewName) {
         let index = this.viewStack.length - 1;
         if (index < 0) {
             return null;
         }
         if (viewName) {
             for (; index >= 0; index--) {
                 let viewCtrl = this.viewStack[index];
                 if (viewCtrl.name === viewName) {
                     return viewCtrl;
                 }
             }
         } else {
             return this.viewStack[index];
         }
     }
 };
 