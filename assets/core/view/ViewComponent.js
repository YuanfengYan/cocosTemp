
/**
 * @title View界面组件的基础类，所有的界面View全部继承这个类
 * @user zfm
 * @date 2019-11-28
 * @description 什么叫做View，就是占了一个整屏幕的预制体组件，这个组件内部可以拥有多个基本预制体
 */

 module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        /** 是否开启缓存 */
        Cache: {
            default: false,
            displayName: '开启缓存'
        },
        /** 是否为子界面 */
        SubView: {
            default: false,
            displayName: '子界面',
            tooltip: '保持上一层界面的渲染'
        },
    },

    ctor () {
        /** 界面的数据 */
        this.$data = null;
        /** 全局的数据 */
        this.$store = null;
    },

    /**
     * @title 当界面被打开的时候
     */
    onViewOpen () {},

    /**
     * @title 当界面被关闭的时候
     */
    onViewClose () {},

    /**
     * @title 界面打开时运行的过场动画
     */
    onOpenAction (cb) {cb(null)},

    /**
     * @title 界面关闭时运行的过场动画
     */
    onCloseAction (cb) {cb(null)},
});
