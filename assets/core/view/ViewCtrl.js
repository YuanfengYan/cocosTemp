/**
 * @title View界面构建器
 * @user zfm
 * @date 2019-11-28
 */

const ViewLoader = require('ViewLoader');

module.exports = class ViewCtrl {
    /** 界面的名字 */
    name = '';
    /** @type {null|{Cache,SplashType,onViewOpen,onViewClose,onOpenAction,onCloseAction}} */
    ctrl = null;
    /** 界面的层级 */
    zIndex = 0;

    /**
     * 界面的渲染节点
     * @type {cc.Node}
     */
    node = null;

    /**
     * @title 隐藏界面
     */
    hideNode () {
        this.node.active = false;
    };

    /**
     * @title 显示界面
     */
    showNode () {
        this.node.active = true;
    };

    /**
     * @title 当界面被打开的时候 触发界面逻辑中的自定义回调事件
     */
    onViewOpen () {
        if (typeof this.ctrl.onViewOpen === 'function') {
            cc.core.Utils.debugLog('打开界面：', this.name);
            this.ctrl.onViewOpen();
        }
    };

    /**
     * @title 当界面被关闭的时候 触发界面中的自定义事件
     */
    onViewClose () {
        if (typeof this.ctrl.onViewClose === 'function') {
            cc.core.Utils.debugLog('关闭界面：', this.name);
            this.ctrl.onViewClose();
        }
    };

    /**
     * @title 打开时需要自动执行的共有事件(走异步，同步会阻塞)
     * @param {function} callback
     */
    autoExecOpenAction (callback) {
        const that = this;
        if (typeof that.ctrl.onOpenAction === 'function') {
            setTimeout(function () {
                cc.core.Utils.debugLog('界面开启动画：', that.name);
                that.ctrl.onOpenAction(callback);
            }, 0);
        } else {
            setTimeout(function () {
                callback(null);
            }, 0);
        }
    };

    /**
     * @title 关闭时需要自动执行的共有事件(走异步，同步会阻塞)
     */
    autoExecCloseAction (callback) {
        const that = this;
        if (typeof that.ctrl.onCloseAction === 'function') {
            setTimeout(function () {
                cc.core.Utils.debugLog('界面关闭动画：', that.name);
                that.ctrl.onCloseAction(callback);
            }, 10);
        } else {
            setTimeout(function () {
                callback(null);
            }, 10);
        }
    };

    /**
     * @title 将节点添加到场景中
     * @param {cc.Node|undefined} parent
     */
    pushNode (parent = undefined) {
        parent = parent || cc.Canvas.instance.node;
        this.node.width = cc.visibleRect.width;
        this.node.height = cc.visibleRect.height;
        this.node.zIndex = this.zIndex;
        this.node.parent = parent;
    };

    /**
     * @title 将节点从场景中弹出（将自己的节点放入缓存池 如果不缓存 就释放节点）
     */
    popNode () {
        if (this.ctrl.Cache) {
            this.node.zIndex = -1;
            this.node.active = false;
            ViewLoader.putCacheView(this.name, this.node);
            this.node.removeFromParent(true);
        } else {
            this.node.destroy();
        }
    };
};
