// 从环境变量获取微信配置
export function getWechatConfig(env) {
  return {
    appId: env.WECHAT_APP_ID,
    appSecret: env.WECHAT_APP_SECRET,
    redirectUri: env.WECHAT_REDIRECT_URI || 'http://mp.ihuhao.com/auth/wechat-callback',
    authorizeUrl: 'https://open.weixin.qq.com/connect/qrconnect',
    accessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo',
    scope: 'snsapi_login',
    tokenExpireTime: 24 * 60 * 60 * 1000
  };
}

// 生成随机字符串，用于 state 参数
export function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Base64URL 编解码工具函数
function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
  const base64 = str + '='.repeat(pad);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// 使用 Web Crypto API 生成 HMAC 签名
async function signHS256(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64UrlEncode(signature);
}

// 生成 JWT
export async function generateToken(payload, env) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // 自动加 exp（1 小时过期）
  const now = Math.floor(Date.now() / 1000);
  payload.iat = now;
  payload.exp = now + 60 * 60;

  const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await signHS256(data, env.JWT_SECRET_KEY);

  return `${data}.${signature}`;
}

// 验证 JWT
export async function verifyToken(token, env) {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature) return null;

    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await signHS256(data, env.JWT_SECRET_KEY);

    if (signature !== expectedSignature) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadJson);

    // 检查是否过期
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Token 验证失败:', err);
    return null;
  }
}
