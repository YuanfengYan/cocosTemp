/**
 * 场景主控制器
 */


cc.macro.ALLOW_IMAGE_BITMAP = false;
cc.macro.CLEANUP_IMAGE_CACHE = true;
cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
cc.macro.ENABLE_MULTI_TOUCH = false;

cc.Class({
    extends: cc.Component,

    properties: {
        ViewContentNode: {
            type: cc.Node,
            default: null,
            displayName: '界面节点'
        },
    },
    onLoad () {},

    start () {

    },
    initGame () {
        this.load_core_bundle()
    },
    /**
     * 加载 Bundle
     */
    load_core_bundle () {
        cc.assetManager.loadBundle('core',()=>{
            console.log('加载完成core')
        });
    },
    

    // update (dt) {},
});
