/*
 * @Description: 公用的静态工具函数
 * @Author: yanyuanfeng
 * @Date: 2021-05-12 10:54:56
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2021-05-13 16:22:37
 */


 function once (fn) {
    return function (...args) {
        if (fn === null) return;
        let callFn = fn;
        fn = null;
        callFn.apply(this, args);
    };
}

module.exports = {
    /**
     * @title 字符串的base64加密
     * @param str
     * @returns {string}
     */
    base64 (str) {
        const utf8 = CryptoJS.enc.Utf8.parse(str);
        return CryptoJS.enc.Base64.stringify(utf8);
    },

    /**
     * @title 字符串的md5
     * @param str
     * @returns {string}
     */
    md5 (str) {
        return CryptoJS.MD5(str).toString();
    },

    /**
     * @title 读取cookie字符串
     * @param {string} key
     * @param {string} value
     * @return {void|*}
     */
    cookie (key, value) {
        if (window.Cookies) {
            return value ? window.Cookies.set(key, value) : window.Cookies.get(key);
        } else {
            return value ? cc.sys.localStorage.setItem(key, value) : cc.sys.localStorage.getItem(key);
        }
    },

    /**
     * @title 同步执行任务（简化版）
     * @param {{}} tasks
     * @param {function} cb
     */
    syncTasks (tasks, cb) {
        cb = once(cb);
        let results = {};
        let keyTasks = Object.keys(tasks);
        let numTasks = keyTasks.length;
        if (!numTasks) {return cb(null, results);}
        function runTask (index) {
            let key = keyTasks[index];
            let taskFun = tasks[key];
            if (typeof taskFun === "function") {
                let taskCb = once(function (err, result) {
                    index++;
                    if (!err) {
                        results[key] = result;
                        if (index === numTasks) {
                            return cb(null, results);
                        } else {
                            runTask(index);
                        }
                    } else {
                        return cb({[key]: err}, results);
                    }
                });
                return taskFun(results, taskCb);
            }
        }
        runTask(0);
    },

    /**
     * @title 异步执行任务（简化版）
     * @param {{}} tasks
     * @param {function} cb
     * @return {*}
     */
    asyncTasks (tasks, cb) {
        cb = once(cb);
        let results = {};
        let numTasks = Object.keys(tasks).length;
        if (!numTasks) {return cb(null, results);}
        Object.keys(tasks).forEach(key => {
            let taskFun = tasks[key];
            if (typeof taskFun === "function") {
                let taskCb = once(function (err, result) {
                    numTasks--;
                    if (!err) {
                        results[key] = result;
                        if (numTasks === 0) {
                            return cb(null, results);
                        }
                    } else {
                        return cb(err, results);
                    }
                });
                // 防止阻塞
                return setTimeout(() => {taskFun(taskCb);}, 0);
            }
        });
    },

    /**
     * @title Object类型的数据排序
     * @param obj
     * @return {Object}
     */
    objSort (obj) {
        const newKey = Object.keys(obj).sort();
        const newObj = {};
        for (let i = 0; i < newKey.length; i += 1) {
            newObj[newKey[i]] = obj[newKey[i]];
        }
        return newObj;
    },

    /**
     * @title 格式化url参数
     * @param queryData
     * @returns {string}
     */
    httpQueryBuild (queryData) {
        let str = '';
        for (let key in queryData) {
            if (queryData.hasOwnProperty(key)) {
                let value = decodeURIComponent(queryData[key]);
                str = `${str}${key}=${value}&`;
            }
        }
        return str.slice(0, str.length - 1);
    },

    /**
     * @title 请求url防串改
     * @param params
     * @param timestamp
     * @param secret_key
     * @param url
     * @returns {*|string}
     */
    requestSign (params, timestamp, secret_key, url) {
        if (url) {
            params = this.objSort(params);
            let queryStr = this.httpQueryBuild(params);
            let md5Str = this.md5(`${url}${queryStr}${timestamp}`);
            return this.md5(`${md5Str}${secret_key}`);
        } else {
            let base64Str = JSON.stringify(params);
            if (base64Str === '{}') { base64Str = '' }
            base64Str = this.base64(base64Str);
            let md5Str = this.md5(`${base64Str}${timestamp}`);
            return this.md5(`${md5Str}${secret_key}`);
        }
    },

    /**
     * @title 产生UUID
     * @return {string}
     */
    uuid () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * @title 产生随机数(整数)
     */
    random (min, max, ignores) {
        min = min || 0;
        max = max == undefined ? 9999 : max;
        ignores = ignores || [];
        let flag = true;
        let ret = min;
        while(flag){
            ret = parseInt(Math.random() * (max - min + 1) + min);
            
            if(ignores.length > (max-min)) flag = false;

            if(flag && ignores.indexOf(ret) < 0) flag = false;
        }
        return ret;
    },

    /**
     * @title 重置屏幕适配
     * @type {number}
     */
    adjustScreen () {
        let frameSize = cc.view.getFrameSize();
        let screen_size = frameSize.width / frameSize.height;
        let design_size = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height;
        let f = screen_size >= design_size;
        cc.Canvas.instance.fitHeight = f;
        cc.Canvas.instance.fitWidth = !f;
    },

    /**
     * @title 获取实际屏幕宽高比
     * @return {number}
     */
    getFrameSizeRatio () {
        let frameSize = cc.view.getFrameSize();
        return frameSize.width / frameSize.height;
    },

    /**
     * @title 按照某个字段对数组排序
     * @param {string} prop
     * @param {string} type
     */
    arraySortBy (prop, type = 'asc') {
        return function (obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (val1 < val2) {
                return type === 'asc' ? -1 : 1;
            } else if (val1 > val2) {
                return type === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        }
    },

    /**
     * @title 清除存储内容
     */
    clearStore () {
        if (cc.sys.isBrowser) {
            return sessionStorage.clear();
        } else {
            /** 保留 */
            let user_id = cc.sys.localStorage.getItem('user_id');
            let visitor_id = cc.sys.localStorage.getItem('visitor_id');
            let auth_token = cc.sys.localStorage.getItem('auth_token');
            cc.sys.localStorage.clear();
            if (user_id && visitor_id && auth_token) {
                cc.sys.localStorage.setItem('user_id', user_id);
                cc.sys.localStorage.setItem('visitor_id', visitor_id);
                cc.sys.localStorage.setItem('auth_token', auth_token);
            }
            return true;
        }
    },

    /**
     * @title 获取一个全局变量
     * @param {string} key
     * @param {boolean} json
     */
    getStoreItem (key, json = false) {
        if (json) {
            if (cc.sys.isBrowser) {
                let str = sessionStorage.getItem(key) || '{}';
                return JSON.parse(str);
            } else {
                let str = cc.sys.localStorage.getItem(key) || '{}';
                return JSON.parse(str);
            }
        } else {
            if (cc.sys.isBrowser) {
                return sessionStorage.getItem(key);
            } else {
                return cc.sys.localStorage.getItem(key);
            }
        }
    },

    /**
     * @title 设置一个全局变量
     * @param {string} key
     * @param {string|number} value
     */
    setStoreItem (key, value) {
        if (!value) {
            if (cc.sys.isBrowser) {
                return sessionStorage.removeItem(key);
            } else {
                return cc.sys.localStorage.removeItem(key);
            }
        } else {
            if (cc.sys.isBrowser) {
                return sessionStorage.setItem(key, value);
            } else {
                return cc.sys.localStorage.setItem(key, value);
            }
        }
    },

    /**
     * @title 解析url参数
     * @param url
     */
    urlParams (url) {
        let params = {};
        let str = url.split('?')[1];
        if (str) {
            let arr = str.split("&");
            for (let i = 0; i < arr.length; i++) {
                let p = arr[i].split("=");
                params[p[0]] = p[1];
            }
        }
        return params;
    },

    /**
     * @title 移除字符串两边的空格
     * @param {string} str
     * @return {*|void|string}
     */
    trim (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },

    /**
     * @title 防抖函数
     * @param {function} func
     * @param {number} delay
     * @return {function(...[*]=)}
     */
    debounce (func, delay = 1000) {
        let timer;
        return function() {
            let args = arguments;
            if (timer) { clearTimeout(timer); }
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        }
    },

    /**
     * @title 节点拖拽函数
     * @param event
     */
    touchNodeDrag (event) {
        event.target.x += event.getDeltaX();
        event.target.y += event.getDeltaY();
    },

    /**
     * @title 检查一个世界节点是否和Node碰撞
     * @param {cc.Vec2|cc.Node} source
     * @param {cc.Node} target
     */
    checkNodeCollide (source, target) {
        let point = null;
        if (source instanceof cc.Node) {
            point = source.convertToWorldSpaceAR(cc.v2(0, 0));
        } else if (source instanceof cc.Vec2) {
            point = source;
        } else {
            return false;
        }
        if (!target.active) {return false;}
        let anchor = target.getAnchorPoint();
        let size = target.getContentSize();
        let position = target.convertToNodeSpaceAR(point);
        let min_x = -(size.width * anchor.x);
        let min_y = -(size.height * anchor.y);
        let max_x = size.width * (1 - anchor.x);
        let max_y = size.height * (1 - anchor.y);
        return position.x > min_x && position.x < max_x && position.y > min_y && position.y < max_y;
    },

    /**
     * @title 播放远程的声音
     * @param {number} voice_id
     * @param {function} cb
     * @param {function} fb
     * @private
     */
    playNPCVoice (voice_id, cb, fb) {
        let voiceClip = cc.aha.Resource.voice(voice_id);
        if (voiceClip instanceof cc.AudioClip) {
            let audioId = cc.audioEngine.play(voiceClip, false, 1);
            cc.audioEngine.setFinishCallback(audioId, function () {
                return fb && fb(null, audioId);
            });
            return cb && cb(null, audioId);
        } else if (typeof voiceClip === "string") {
            cc.assetManager.loadRemote(voiceClip, cc.AudioClip, (err, audioClip) => {
                if (!err) {
                    audioClip.addRef();
                    let audioId = cc.audioEngine.play(audioClip, false, 1);
                    cc.audioEngine.setFinishCallback(audioId, function () {
                        audioClip.decRef() // 远程加载的就及时释放了
                        return fb && fb(null, audioId);
                    });
                    return cb && cb(null, audioId);
                } else {
                    return cb && cb(err, 0);
                }
            });
        } else {
            return cb && cb(true, 0);
        }
    },

    /**
     * @title 洗牌算法,打乱数组
     * @param {array} ary
     */
    shuffle(ary){
        for(let i=ary.length-1;i>0;i--)
        {
            let idx = Math.round(Math.random() * i);
            if(idx === i) continue;
            [ary[i], ary[idx]] = [ary[idx], ary[i]];
        }
    },

    /**
     * @title 根据最大尺寸按原图比例适配图片防止拉伸
     * @param {cc.Texture2D} texture
     * @param {cc.Sprite} sp
     * @param {number} max_w
     * @param {number} max_h
     */
    adaptImage(texture, sp, max_w, max_h){
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        let tex_w = texture.width;
        let tex_h = texture.height;
        let scale_w = tex_w > max_w ? max_w / tex_w : 1;
        let scale_h = tex_h > max_h ? max_h / tex_h : 1;
        let scale = Math.min(scale_w, scale_h);
        sp.node.width = tex_w * scale;
        sp.node.height = tex_h * scale;
    },

    /**
     * @title 获取当前的格式化时间
     */
    getLocaleTime () {
        let myDate = new Date();
        return myDate.toLocaleString();
    },

    /**
     * @title 获取当前的时间戳（s）
     * @return {number}
     */
    getTime () {
        let myDate = new Date();
        return Math.ceil(myDate.getTime()/1000);
    },

    /**
     * @title 转化秒为时分秒
     * @param {number} time 时间s
     */
    time2HMS (time) {
        let h = 0, m = 0, s = 0;
        if (typeof time !== "number") {time = Number(time);}
        s = time%60;
        let _m = Math.floor(time/60);
        m = _m%60; h = Math.floor(_m/60);
        return {h, m, s};
    },

    /**
     * @title 判断是否为允许的key
     */
    isAllowKey (str) {
        let reg = new RegExp(/^[A-Za-z0-9_-]+$/i);
        return reg.test(str);
    },

    /**
     * @title 字符串解析器（自定义了一套简单的数据结构，复杂的使用json）
     * @desc click&tpl_key:level_map_001&map_id:1|key => [{click:true,tpl_key:level_map_001,map_id:1},{key:true}]
     * @param {string} str
     * @param {boolean} and
     * @private
     */
    decodeAttrs (str, and = true) {
        str = typeof str === "string" ? str : String(str);
        let attrs = and ? [] : {}, arr = str.split('|');
        for (let i = 0; i < arr.length; i++) {
            let a = arr[i].split('&');
            let obj = {};
            for (let j = 0; j < a.length; j++) {
                let s = a[j];
                let k_v = s.split(':');
                let k = cc.aha.Utils.trim(k_v[0]);
                let v = k_v[1] ? cc.aha.Utils.trim(k_v[1]) : true;
                if (k && v) {obj[k] = String(v);}
            }
            and ? attrs.push(obj) : attrs = Object.assign(attrs, obj);
        }
        return attrs;
    },

    /**
     * @title 数组去重
     * @param {[number]} arr
     * @return {*}
     */
    uniqueNum (arr) {
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            let n = Number(arr[i]);
            if (!arr2.includes(n)) {
                arr2.push(n);
            }
        }
        return arr2;
    },

    /**
     * @title 打印调试日志
     */
    debugLog (msg, ...args) {
        if (Global.Env.Debug) {
            console.log(msg, ...args);
        }
    },

    /**
     * @title 设置body的透明度,会联动设置相机的
     * @param {boolean} alpha
     */
    setBodyAlpha (alpha) {
        cc.Camera.main.backgroundColor.setR(alpha ? 0 : 255);
        if (typeof aha_body_alpha === "function") {
            return aha_body_alpha(alpha);
        }
    },

    /**
     * @title 将节点内容导出为图片
     * @param {cc.Node} node
     */
    captureNode2Base64 (node) {
        // 初始化渲染纹理
        let width = node.width;
        let height = node.height;
        let w_h = width / height;
        let vw_vh = cc.visibleRect.width / cc.visibleRect.height;
        let _texture = new cc.RenderTexture();
        _texture.initWithSize(width, height, cc.gfx.RB_FMT_S8);

        // 获取canvas画布
        let _canvas = document.getElementById('capture_canvas');
        if (!_canvas) {
            _canvas = document.createElement('canvas');
            _canvas.setAttribute('id', 'capture_canvas');
        }
        _canvas.width = width;
        _canvas.height = height;
        let _ctx = _canvas.getContext('2d');

        // 克隆需要渲染的节点
        let _content = cc.instantiate(node);
        _content.parent = cc.Canvas.instance.node;
        _content.position = cc.v3(0, 0, 0);
        _content.scale = w_h > vw_vh ? (cc.visibleRect.width / width) + 0.02 : (cc.visibleRect.height / height) + 0.02;
        let _camera = _content.addComponent(cc.Camera);
        _camera.alignWithScreen = true;
        _camera.clearFlags = 7;
        _camera.targetTexture = _texture;
        _camera.render(_content);

        // 渲染图片到canvas
        let data = _texture.readPixels();
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = _ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
            _ctx.putImageData(imageData, 0, row);
        }

        // 销毁临时节点
        _content.destroy();
        _texture.destroy();
        return _canvas.toDataURL("image/png");
    },

    /**
     * 可以截取渲染组件渲染特效后的节点
     * @title 将节点截图 并 返回一个截图后的新node 和 base64
     * @param {cc.Node} node
     * @return {cc.Node base64}
     */
    captureNode(nodeCapture){
        let dataURL = this.captureNode2Base64New(nodeCapture);

        let img = document.createElement("img");
        img.src = dataURL;

        let texture2D = new cc.Texture2D();
        texture2D.initWithElement(img);

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture2D);

        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        node.setContentSize(nodeCapture.getContentSize());
        return { node, dataURL };
    },

    /**
     * 可以截取渲染组件渲染特效后的节点
     * @title 将节点截图 并 返回一个截图后的base64
     * @param {cc.Node} node
     * @return {cc.Node} node
     */
     captureNode2Base64New(nodeCapture){
        let time = Date.now();
        //执行渲染的node
        let nodeCamera = new cc.Node();
        nodeCamera.parent = cc.find("Canvas");
        let camera = nodeCamera.addComponent(cc.Camera);

        let position = nodeCapture.getPosition();
        let width = Math.floor(nodeCapture.width);
        let height = Math.floor(nodeCapture.height);

        camera.alignWithScreen = false;
        camera.ortho = true;
        camera.orthoSize = height / 2;

        /**渲染的内容 */
        let texture = new cc.RenderTexture();
        texture.initWithSize(width, height, cc.gfx.RB_FMT_S8);

        camera.targetTexture = texture;
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext('2d');
        nodeCapture.setPosition(cc.Vec2.ZERO);
        camera.render(nodeCapture);
        nodeCapture.setPosition(position);
        let data = texture.readPixels();

        let rowBytes = width * 4;
        // 依次读取图片里的每行数据，放入到ctx中。
        for (let row = 0; row < height; row++) {
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // DEMO 写法（高性能，兼容性好） 比上边的快200ms左右
            // 参考于 https://forum.cocos.org/t/cocoscreator/72580/17
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            let srow = height - 1 - row;
            // 从图片的所有数据中，获取一行的图片字节数据
            let oneLineImageData = new Uint8ClampedArray(data.buffer, Math.floor(srow * width * 4), rowBytes);
            // 设置图片数据对象
            // 设置一个一行的图片，所以就是 width, 1
            let imageData = new ImageData(oneLineImageData, width, 1);
            ctx.putImageData(imageData, 0, row);
        }

        let dataURL = canvas.toDataURL("image/png");
        nodeCamera.destroy();
        texture.destroy();
        this.debugLog(`截图耗时: ${Date.now() - time}`);
        return dataURL;
    },
    /**
     * 坐标是否在三角形内
     * @param {*} point 
     */
    PointInTriangle(point, triA, triB, triC){
        let AB = triB.sub(triA), AC = triC.sub(triA), BC = triC.sub(triB), AD = point.sub(triA), BD = point.sub(triB);
        return (AB.cross(AC) >= 0 ^ AB.cross(AD) < 0)  // D,C 在AB同同方向
            && (AB.cross(AC) >= 0 ^ AC.cross(AD) >= 0) // D,B 在AC同同方向
            && (BC.cross(AB) > 0 ^ BC.cross(BD) >= 0); // D,A 在BC同同方向
    }
};
