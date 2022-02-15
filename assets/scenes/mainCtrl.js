/**
 * 场景主控制器
 */


// cc.macro.ALLOW_IMAGE_BITMAP = false;
// cc.macro.CLEANUP_IMAGE_CACHE = true;
// cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
// cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
// cc.macro.ENABLE_MULTI_TOUCH = false;

cc.Class({
    extends: cc.Component,

    properties: {
        ViewContentNode: {
            type: cc.Node,
            default: null,
            displayName: '界面节点'
        },
        DemoView :{
            type: cc.Prefab,
            default: null,
            displayName: 'Demo'
        }
    },
    onLoad () {
        this.initGame()
    },

    start () {

    },
    initGame () {
        console.log(window.Global)
        Promise.all([this.load_core_bundle()]).then(()=>{
            cc.core.ViewManager.showView(this.DemoView,'DemoView')
        })
    },
    
    /**
     * 加载 Bundle
     */
    load_core_bundle () {
        return new Promise((resolve, reject)=>{
            cc.assetManager.loadBundle('core',()=>{
                console.log('加载完成core')
                resolve()
            });
        })
    },
    

    // update (dt) {},
});
