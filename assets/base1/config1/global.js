/**
 * @title 定义全局的变量（程序运行过程中不准修改，如果需要修改请重新声明一个变量）注意：这个文件不参与编译，请使用es5的语法
 * @type {{}}
 */
 var Debug = false;

 // // //##AHADEBUG
 // Debug = true;
 // // //AHADEBUG##
 
 var AppEnv = 'prod';
 var Params = {};
 if (!cc.sys.isNative) {
     const url_params = function (url) {
         var params = {};
         var str = url.split('?')[1];
         if (str) {
             var arr = str.split("&");
             for (var i = 0; i < arr.length; i++) {
                 var p = arr[i].split("=");
                 params[p[0]] = p[1];
             }
         }
         return params;
     }
     /** 读取连接中的game参数 默认是id=1 */
     try {
         Params = url_params(window.location.href);
         AppEnv = Params['env'] || AppEnv;
         Debug = Params['debug'] ? !!Number(Params['debug']) : Debug;
     } catch (e) {
         console.error(e);
     }
     /** app的默认回调函数 */
     try {
         if (typeof window.AHASCHOOL == 'undefined') { window.AHASCHOOL = {}; }
         window.AHASCHOOL.onEvaluationEvent = function (res) { };
         window.AHASCHOOL.onAudioInfoChanged = function (res) { };
         window.AHASCHOOL.traitCollectionDidChange = function (res) { };
         window.AHASCHOOL.onVideoPlayerEvent = function (res) { };
     } catch (e) {
         console.error(e);
     }
 }
 /** 请求的网关地址 */
 var gateways = {
     prod: {
         SecretKey: '4470c4bd3d88be85f031cce6bd907329',
         GatewayUrl: 'https://openapi2.ahaschool.com.cn'
     },
     test1: {
         SecretKey: 'd1f1bd03e3b0e08d6ebbecaa60e14445',
         GatewayUrl: 'https://api-test.d.ahaschool.com'
     },
     test2: {
         SecretKey: 'd1f1bd03e3b0e08d6ebbecaa60e14445',
         GatewayUrl: 'https://api-test2.d.ahaschool.com'
     },
     test3: {
         SecretKey: 'd1f1bd03e3b0e08d6ebbecaa60e14445',
         GatewayUrl: 'https://api-test3.d.ahaschool.com'
     },
     test4: {
         SecretKey: 'd1f1bd03e3b0e08d6ebbecaa60e14445',
         GatewayUrl: 'https://api-test4.d.ahaschool.com'
     },
     test5: {
         SecretKey: 'd1f1bd03e3b0e08d6ebbecaa60e14445',
         GatewayUrl: 'https://api-test5.d.ahaschool.com'
     },
     test6: {
         SecretKey: 'd1f1bd03e3b0e08d6ebbecaa60e14445',
         GatewayUrl: 'https://api-test6.d.ahaschool.com'
     }
 }
 window.Global = {
     Href: window && window.location ? window.location.href : '',
     /** 用户ID */
     UserId: 0,
     /** 调试参数 */
     DEBUG: 'debug',
     /** 屏幕的宽 */
     ScreenWidth: 1334,
     /** 屏幕的高 */
     ScreenHeight: 750,
     /** 课程的信息 */
     Params: Params,
     /** 设备信息 */
     DeviceInfo: {
         platform: cc.sys.os,         // 设备的系统
         osVersion: cc.sys.osVersion, // 系统版本号
         muteMode: 0,                 // 是否静音
         memory: 1024,                // 设备的内存
     },
     /** 设置信息 */
     SettingInfo: {
         VideoQuality: 'sd', // 视频质量
         BGMVolume: 0.5,     // 背景音乐音量
         VoiceVolume: 0.5,   // 音效音量
     },
     /** gio上报信息 */
     GioInfo:{
        draw_step_type: '2', // 画一画视频类型
        play_step_type: '3', // 玩一玩类型
     },
     /** 接口环境 */
     Env: {
         Debug: Debug,
         AppEnv: AppEnv, // prod是只显示确认上线的关卡
         AppType: '17',  // 请求接口的APP类型
         Channel: 'ai',  // 请求接口的频道
         Timeout: 10000, // 请求接口的超时时间
         AppVersion: 'v2.0.0', // 本项目的版本
         TokenKey: 'auth_token', // 用户token的key
         WxAppId: '',  // 微信小游戏的appid
         GioAppId: 'bb75da58b3ad3389', // GIO的appid
         LocalPath: '/resources/ai/lesson/', // 本地资源的路径
         DefToken: 'visitor:28ad87ef9fdce5d12dea093b860e8772', // 游客模式下的默认token
         SecretKey: gateways[AppEnv] ? gateways[AppEnv].SecretKey : '4470c4bd3d88be85f031cce6bd907329',
         GatewayUrl: gateways[AppEnv] ? gateways[AppEnv].GatewayUrl : 'https://openapi2.ahaschool.com.cn',
     },
     /** 接口地址 */
     Url: {
         LogPush: '/v3/logs/create',                             // 日志数据上报
         UserInfo: '/v3/userbff/users/info',                     // 用户数据获取
         UserGold: '/v3/appbff/user/credit/get',                 // 用户金币获取
         NextStepGet: '/v3/appbff/aicourse/step/nextstep/get',   // 获取下一个环节
         StepInterGet: '/v3/appbff/aicourse/step/get', // 获取环节数据
         GoldDataPush: '/v3/appbff/aicourse/usercredit/create',  // 金币数据上报
         StepDataPush: '/v3/appbff/aicourse/step/stepart/create',// 环节数据上报
         QiNiuTokenGet: '/v3/support/qiniu/uptoken/get',         // 获取七牛凭证
         UserCaptchaGet: '/v3/userbff/visitor/captcha/get',      // 发送验证码
         UserMobileLogin: '/v3/userbff/visitor/mobile/login',    // 手机号登录
     },
     /** 全局监听的事件类型 */
     EventType: {
         ON_ERROR: 'ON_ERROR',                               // 错误提示事件
         ON_USER_LOGIN: 'ON_USER_LOGIN',                     // 用户登录完成
         ON_SHOW_ABOUT: 'ON_SHOW_ABOUT',                     // 显示确认界面
         ON_SHOW_ALERT: 'ON_SHOW_ALERT',                     // 显示弹窗界面
         ON_SHOW_INTER: 'ON_SHOW_INTER',                     // 显示互动界面
         ON_HIDE_INTER: 'ON_HIDE_INTER',                     // 退出互动界面
         ON_SHOW_PHOTO: 'ON_SHOW_PHOTO',                     // 显示照相界面
         ON_SHOW_SETTLE: 'ON_SHOW_SETTLE',                   // 显示结算界面
         ON_SHOW_FINISH: 'ON_SHOW_FINISH',                   // 显示环节完成
         ON_SHOW_GOLD: 'ON_SHOW_GOLD',                       // 显示金币界面
         ON_CLOSE_VIEW: 'ON_CLOSE_VIEW',                     // 关闭当前界面
         ON_PUSH_GOLD_NUM: 'ON_PUSH_GOLD_NUM',               // 上报金币数量
         ON_PUSH_STEP_DATA: 'ON_PUSH_STEP_DATA',             // 上报环节数据
         ON_GAME_LOADING: 'ON_GAME_LOADING',                 // 全局加载动画
         ON_SHOW_LOADING: 'ON_SHOW_LOADING',                 // 显示Loading
         ON_HIDE_LOADING: 'ON_HIDE_LOADING',                 // 隐藏Loading
 
         ON_GAME_ACTIVE_CHANGE: 'ON_GAME_ACTIVE_CHANGE',     //游戏失活 切入后台/点击返回按键
 
         /** ===================GIO==================== */
         ON_GIO_INIT: 'ON_GIO_INIT',                         //通知gio开始初始化
         ON_GIO_STEP_OPEN: 'ON_GIO_STEP_OPEN',               //进入环节
         ON_GIO_CREATIVE_TIME: 'ON_GIO_CREATIVE_TIME',       //创作时长
         ON_GIO_STEP_DATA_BACK: 'ON_GIO_STEP_DATA_BACK',     //环节完成信息返回
         ON_GIO_SHOW_INTER: 'ON_GIO_SHOW_INTER',             //进入互动计时
 
         ON_GIO_POINT_INTER: 'ON_GIO_POINT_INTER',           //进入互动点
         ON_GIO_POINT_OUTER: 'ON_GIO_POINT_OUTER',           //退出互动点
     },
     /** 系统错误信息 */
     ErrorCode: {
         DEFAULT: { type: 'default', title: '发生错误了哦', timeout: 3 },                // 默认错误
         NETWORK: { type: 'network', title: '网络断开了哦', timeout: 8 },                // 网络错误
         DEBUG_ERR: { type: 'debug', title: '预览数据失败', timeout: 3 },                // 开发版
         NEED_DOWN: { type: 'need_down', title: '请先完成前面的冒险吧', close: true },      // 需要完成前面关卡
         STAGE_LOCK: { type: 'stage_lock', title: '今天的冒险完成了，明天再来吧，（每天上一课哦）', close: true },   // 关卡被锁定
         NEED_LOGIN: { type: 'need_login', title: '请先登录', timeout: 3 },             // 需要登录
         PERMISSION: { type: 'permission', title: '还没有购买解锁权限的钥匙哦', close: true }, // 权限受限
     },
     /** 交互的承载模式 */
     ModePath: {
         mode_001: 'modes/mode_001/Mode001View',                    // 视频互动模式
         mode_002: 'modes/mode_002/Mode002View',                    // 答题互动模式
         mode_003: 'modes/mode_003/Mode003View',                    // 脚本互动模式
     },
     /** 互动游戏的资源路径 */
     InteractsPath: {
         interact_000: 'interacts/interact_000/Interact000View',    // 示列互动
         interact_001: 'interacts/interact_001/Interact001View',    // 画一画回看互动
         interact_002: 'interacts/interact_002/Interact002View',    // 玩一玩涂色互动
         interact_003: 'interacts/interact_003/Interact003View',    // 看一看选择互动
         interact_004: 'interacts/interact_004/Interact004View',    // 敲敲乐互动
         interact_005: 'interacts/interact_005/Interact005View',    // 看一看拖拽互动
         interact_006: 'interacts/interact_006/Interact006View',    // 答一答分类互动
         interact_007: 'interacts/interact_007/Interact007View',    // 答一答选择互动
         interact_008: 'interacts/interact_008/Interact008View',    // 玩一玩拼图互动
         interact_009: 'interacts/interact_009/Interact009View',    // 答一答选择互动（图片多选一）
         interact_010: 'interacts/interact_010/Interact010View',    // 答一答选择互动（对错判断）
         interact_011: 'interacts/interact_011/Interact011View',    // 看一看唱片集互动（修改版）
         interact_012: 'interacts/interact_012/Interact012View',    // 玩一玩拼图互动（拖动放置）
         interact_013: 'interacts/interact_013/Interact013View',    // 拖拽互动（拖动放置）
         interact_014: 'interacts/interact_014/Interact014View',    // 语文多选互动
         interact_015: 'interacts/interact_015/Interact015View',    // 语文跟读互动
         interact_016: 'interacts/interact_016/Interact016View',    // 看一看任意拖拽互动
         interact_017: 'interacts/interact_017/Interact017View',    // 看一看乌鸦互动
         interact_018: 'interacts/interact_018/Interact018View',    // 看一看对称点选互动
         interact_019: 'interacts/interact_019/Interact019View',    // 看一看珍珠互动
         interact_020: 'interacts/interact_020/Interact020View',    // 看一看描红互动
         interact_021: 'interacts/interact_021/Interact021View',    // 看一看点击互动
         interact_022: 'interacts/interact_022/Interact022View',    // 玩一玩山川材质填充
         interact_023: 'interacts/interact_023/Interact023View',    // 玩一玩线条手指舞互动
         interact_024: 'interacts/interact_024/Interact024View',    // 玩一玩墨墨鱼的比赛互动
         interact_025: 'interacts/interact_025/Interact025View',    // 看一看过山车互动
         interact_026: 'interacts/interact_026/Interact026View',    // 看一看飞鸟互动
         interact_027: 'interacts/interact_027/Interact027View',    // 看一看平行线点选
         interact_028: 'interacts/interact_028/Interact028View',    // 看一看重复描红互动
         interact_029: 'interacts/interact_029/Interact029View',    // 玩一玩连线描红互动
         interact_030: 'interacts/interact_030/Interact030View',    // 玩一玩乐器涂色互动
         interact_031: 'interacts/interact_031/Interact031View',    // 看一看拖拽旋转互动
         interact_032: 'interacts/interact_032/Interact032View',    // 看一看分步描红互动
         interact_033: 'interacts/interact_033/Interact033View',    // 玩一玩飞行器互动
         interact_034: 'interacts/interact_034/Interact034View',    // 跟随
         interact_035: 'interacts/interact_035/Interact035View',    // 跟随
         interact_036: 'interacts/interact_036/Interact036View',    // 玩一玩太阳花互动
         interact_037: 'interacts/interact_037/Interact037View',    // 玩一玩星球旋转互动
         interact_038: 'interacts/interact_038/Interact038View',    // 跟随
         interact_039: 'interacts/interact_039/Interact039View',    // 玩一玩半圆互动
         interact_040: 'interacts/interact_040/Interact040View',    // 看一看折扇互动
         interact_041: 'interacts/interact_041/Interact041View',    // 跟随
         interact_042: 'interacts/interact_042/Interact042View',    // 玩一玩美食魔法树互动
         interact_043: 'interacts/interact_043/Interact043View',    // 玩一玩线条叠叠乐互动
         interact_044: 'interacts/interact_044/Interact044View',    // 点击判定交互
         interact_045: 'interacts/interact_045/Interact045View',    // 找一找模板
         interact_046: 'interacts/interact_046/Interact046View',    // 长按划线山水画
         interact_047: 'interacts/interact_047/Interact047View',    // 玩一玩线条星空
         interact_048: 'interacts/interact_048/Interact048View',    // 玩一玩曲线动起来互动
         interact_049: 'interacts/interact_049/Interact049View',    // 看一看变大变小变三角
         interact_050: 'interacts/interact_050/Interact050View',    // 连一连1 选择配对
         interact_051: 'interacts/interact_051/Interact051View',    // 连一连2 组合图形
         interact_052: 'interacts/interact_052/Interact052View',    // 拖动区域交互互动
         interact_053: 'interacts/interact_053/Interact053View',    // 玩一玩 剪刀互动马蒂斯的图案派对
         interact_054: 'interacts/interact_054/Interact054View',    // 玩一玩 百变面孔
         interact_055: 'interacts/interact_055/Interact055View',    // 看一看
         interact_056: 'interacts/interact_056/Interact056View',    // 玩一玩超能力面具
         interact_057: 'interacts/interact_057/Interact057View',    // 答一答新模板
         interact_058: 'interacts/interact_058/Interact058View',    // 看一看海市蜃楼城
         interact_059: 'interacts/interact_059/Interact059View',    // 看一看布吉岛惊险之旅
     },
     /** 不同环节类型的结算规则 */
     SettleRule: {
         0: { // 看一看
             inter_tasks: [
                 { type: 'gold', effect: false, delay: 1, num: 3 }
             ], // 完成互动结算
             step_tasks: [ // 完成环节结算
                 { type: 'gold', effect: false, delay: 0.5, num: 5 },
                 { type: 'gem', delay: 1.5, level: 1 }
             ]
         },
         1: { // 答一答
             inter_tasks: [
                 { type: 'gold', effect: true, delay: 1, num: 1, level_num: { type: 'added', num: 2, added: 1 } } // added 表示额外金币 在完美答题的时候附加
                 // { type: 'gold', effect: false, delay: 0.5, num: 5 },
                 // { type: 'gem', delay: 1.5, level: 1 }
             ],
             step_tasks: null
         },
         2: { // 画一画
             inter_tasks: null,
             step_tasks: [ // 完成环节结算
                 { type: 'gold', effect: false, delay: 1, num: 10 }
             ]
         },
         3: { // 玩一玩
             inter_tasks: null,
             step_tasks: [ // 完成环节结算
                 { type: 'gold', effect: false, delay: 0, num: 5 },
                 { type: 'gem', delay: 0, level: 3 }
             ]
         },
         5: { // 看视频
             inter_tasks: null,
             step_tasks: [ // 完成环节结算
                 { type: 'victory', delay: 2 },
                 { type: 'gold', effect: false, delay: 2, num: 5 }
             ]
         },
         6: { // 拼一拼
             inter_tasks: null,
             step_tasks: [ // 完成环节结算
                 { type: 'victory', delay: 2 },
                 { type: 'gold', effect: false, delay: 2, num: 5 }
             ]
         },
         8: { // 练一练
             inter_tasks: [
                 { type: 'gold', effect: true, delay: 2, num: 1, level_num: { type: 'added', num: 2, added: 1 } } // added 表示额外金币 在完美答题的时候附加
             ],
             step_tasks: [
                 { type: 'gem', delay: 0, level: 2 }
             ]
         },
         9: { // 读一读
             inter_tasks: null,
             step_tasks: [ // 完成环节结算
                 { type: 'victory', delay: 2 },
                 { type: 'gold', effect: false, delay: 2, num: 3, level_num: { type: 'double', num: 3, double: 1 } } // double 表示额外金币 在完美答题的时候翻倍
             ]
         },
         10: { // 找一找
             inter_tasks: null,
             step_tasks: [ // 完成环节结算
                 { type: 'victory', delay: 2 },
                 { type: 'gold', effect: false, delay: 2, num: 5 }
             ]
         },
     }
 }
 