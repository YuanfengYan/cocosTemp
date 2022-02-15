/**
 * @title 界面里面进行数据加载的方法（实现的界面缓存）
 * @user zfm
 * @date 2019-11-28
 * @type {{}}
 */

const Utils = require('Utils');

module.exports = {

    /**
     * @title View界面缓存池
     */
    _cache: {},

    /**
     * @title 创建一个缓存key（根据资源的名字进行MD5加密）
     */
    makeCacheKey (url) {
        return Utils.md5(url);
    },

    /**
     * @title 创建view实例
     * @param {cc.Prefab|string} prefab 需要实例化的View界面
     * @param {string} name 界面的名字（这个界面下面所有的资源缓存会记录到这个名字下面 释放的时候会根据这个名字释放资源）
     * @param {function} callback 回调函数
     * @return {cc.Node|*}
     */
    getViewNode (prefab, name, callback) {
        if (!name) {
            return callback('function getViewNode params name is error');
        }
        let viewNode = this.getCacheView(name);
        if (viewNode instanceof cc.Node) {
            return callback(null, viewNode)
        } else {
            if (typeof prefab === 'string') {
                cc.resources.load(prefab, cc.Prefab, function (error, resPrefab) {
                    if (error) {
                        return callback(`function getViewNode loadRes exec error: ${error}`);
                    }
                    viewNode = cc.instantiate(resPrefab);
                    return callback(null, viewNode);
                });
            } else if (typeof prefab === 'object' && prefab instanceof cc.Prefab) {
                viewNode = cc.instantiate(prefab);
                return callback(null, viewNode);
            } else {
                return callback('function getViewNode params prefab is error, type need string or cc.Prefab');
            }
        }
    },

    /**
     * @title 获取界面缓存节点
     * @param {string} name
     * @return {cc.Node|null}
     */
    getCacheView (name) {
        let viewNode = null;
        const cacheKey = this.makeCacheKey(name);
        if (this._cache[cacheKey]) {
            viewNode = this._cache[cacheKey];
            this._cache[cacheKey] = null;
        }
        return viewNode;
    },

    /**
     * @title 缓存界面节点
     * @param {string} name
     * @param {cc.Node} viewNode
     */
    putCacheView (name, viewNode) {
        const cacheKey = this.makeCacheKey(name);
        if (this._cache[cacheKey] !== viewNode) {
            this._cache[cacheKey] = viewNode;
        }
    }
};
