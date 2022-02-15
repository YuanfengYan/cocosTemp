/**
 * @title 像素级别的精确点击，不规则图片点击
 *        （有一定的性能消耗，非必要时不开启）
 * @user zfm
 * @date 2020-04-01
 */
const _mat4_temp = cc.mat4();
const _htVec3a = new cc.Vec3();
const _htVec3b = new cc.Vec3();
module.exports = cc.Class({
    extends: cc.Component,
    properties: {
        HitTestGroup: 'hit'
    },
    onLoad() {
        this.default_group = this.node.group;
        this.node._hitTest = this._hitTest.bind(this);
        this.texture = new cc.RenderTexture();
        this.texture.initWithSize(10, 10);
        let node = new cc.Node();
        node.parent = this.node;
        this.camera = node.addComponent(cc.Camera);
        this.camera.alignWithScreen = false;
        this.camera.orthoSize = 10;
        this.camera.clearFlags = 7;
        this.camera.targetTexture = this.texture;
        this.node.group = this.HitTestGroup;
        this.camera.cullingMask = 1<<this.node.groupIndex;
        this.node.group = this.default_group;
        node.active = false;
    },
    /**
     * @title 重写点击监听
     * @param {cc.Vec3} point
     * @return {boolean}
     * @private
     */
    _hitTest (point) {
        let w = this.node._contentSize.width,
            h = this.node._contentSize.height,
            cameraPt = _htVec3a,
            testPt = _htVec3b;

        let camera = cc.Camera.findCamera(this.node);
        if (camera) {
            camera.getScreenToWorldPoint(point, cameraPt);
        } else {
            cameraPt.set(point);
        }

        this.node._updateWorldMatrix();
        if (!cc.Mat4.invert(_mat4_temp, this.node._worldMatrix)) {
            return false;
        }
        cc.Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += this.node._anchorPoint.x * w;
        testPt.y += this.node._anchorPoint.y * h;

        let hit = false;
        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
            let c_point = this.node.convertToNodeSpaceAR(point);
            this.camera.node.x = c_point.x;
            this.camera.node.y = c_point.y;
            this.node.group = this.HitTestGroup;
            this.camera.node.active = true;
            this.camera.render();
            this.camera.node.active = false;
            this.node.group = this.default_group;
            let data = this.texture.readPixels();
            let len = parseInt(data.length / 4);
            for (let i = 0; i < len; i++) {
                let arr = [];
                if(data.slice){
                    arr = data.slice(i * 4, i * 4 + 4);
                }else{
                    for(let j = i * 4; j < i * 4 + 4; ++j){
                        arr.push(data[j]);
                    }
                }
                let sum = arr.reduce(function (p, n) { return p + n; });
                if (sum > 255) { hit = true; break; }
            }
        }
        return hit;
    }
});
