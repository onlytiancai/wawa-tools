import { verifyToken } from './config.js';

export async function onRequest({ request, params, env }) {
  try {
    // 获取请求体中的 token
    const { token } = await request.json();
    
    if (!token) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: '缺少 token 参数',
        }),
        {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // 验证 token
    const payload = verifyToken(token, env);
    
    if (!payload) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: '无效的 token',
        }),
        {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // 从 KV 存储中获取用户信息
    const userJson = await my_kv.get(`user_${payload.openid}`);
    
    if (!userJson) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: '用户不存在',
        }),
        {
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // 返回验证结果
    return new Response(
      JSON.stringify({
        valid: true,
        openid: payload.openid,
      }),
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    console.error('验证 token 失败:', err);
    
    return new Response(
      JSON.stringify({
        valid: false,
        error: '验证 token 失败',
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