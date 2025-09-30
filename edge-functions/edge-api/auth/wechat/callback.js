import { getWechatConfig, generateToken } from '../config.js';

export async function onRequest({ request, params, env }) {
  const wechatConfig = getWechatConfig(env);
  

  try {
    // 获取请求体中的 code 和 state
    const { code, state } = await request.json();

    console.error('wechat callback code, state', code, state);

    if (!code || !state) {
      return new Response(
        JSON.stringify({
          error: '缺少必要参数',
        }),
        {
          status: 400,
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 验证 state 参数，防止 CSRF 攻击
    const savedState = await my_kv.get(`wechat_state_${state}`);
    if (!savedState) {
      return new Response(
        JSON.stringify({
          error: '无效的 state 参数',
        }),
        {
          status: 400,
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 删除已使用的 state
    await my_kv.delete(`wechat_state_${state}`);

    // 使用 code 获取 access_token
    const tokenResponse = await fetch(`${wechatConfig.accessTokenUrl}?appid=${wechatConfig.appId}&secret=${wechatConfig.appSecret}&code=${code}&grant_type=authorization_code`);
    const responseText = await tokenResponse.text();
    console.error('Raw response:', responseText);
    const tokenData = JSON.parse(responseText);

    if (tokenData.errcode) {
      throw new Error(`获取 access_token 失败: ${tokenData.errmsg}`);
    }

    const { access_token, openid, refresh_token, expires_in } = tokenData;

    // 使用 access_token 和 openid 获取用户信息
    const userInfoResponse = await fetch(`${wechatConfig.userInfoUrl}?access_token=${access_token}&openid=${openid}`);
    const userInfo = await userInfoResponse.json();

    if (userInfo.errcode) {
      throw new Error(`获取用户信息失败: ${userInfo.errmsg}`);
    }

    // 生成用户 token
    const token = generateToken({
      openid: userInfo.openid,
      exp: Date.now() + wechatConfig.tokenExpireTime,
    }, env);

    // 保存用户信息到 KV 存储
    const user = {
      openid: userInfo.openid,
      nickname: userInfo.nickname,
      avatar: userInfo.headimgurl,
      token,
      lastLogin: Date.now(),
    };

    await my_kv.put(`user_${userInfo.openid}`, JSON.stringify(user));

    // 返回用户信息和 token
    return new Response(
      JSON.stringify({
        user,
      }),
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    console.error('微信登录回调处理失败:', err);

    return new Response(
      JSON.stringify({
        error: '微信登录回调处理失败',
        message: err.message,
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}