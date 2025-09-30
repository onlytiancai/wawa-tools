import { getWechatConfig, generateRandomString } from '../config.js';

export async function onRequest({ request, params, env }) {
  const wechatConfig = getWechatConfig(env);

  try {
    // 生成随机 state，用于防止 CSRF 攻击
    const state = generateRandomString(16);
    
    // 将 state 保存到 KV 存储，用于后续验证
    await my_kv.put(`wechat_state_${state}`, 'true', { expirationTtl: 600 }); // 10分钟有效期
    
    // 构建微信授权 URL
    const authUrl = new URL(wechatConfig.authorizeUrl);
    authUrl.searchParams.append('appid', wechatConfig.appId);
    authUrl.searchParams.append('redirect_uri', wechatConfig.redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', wechatConfig.scope);
    authUrl.searchParams.append('state', state);
    
    // 返回授权 URL
    return new Response(
      JSON.stringify({
        authUrl: authUrl.toString(),
        state
      }),
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    console.error('获取微信授权 URL 失败:', err);
    
    return new Response(
      JSON.stringify({
        error: '获取微信授权 URL 失败',
        message: err.message
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