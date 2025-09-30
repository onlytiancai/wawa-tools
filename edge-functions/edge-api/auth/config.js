// 从环境变量获取微信配置
export function getWechatConfig(env) {
  return {
    appId: env.WECHAT_APP_ID,
    appSecret: env.WECHAT_APP_SECRET,
    redirectUri: env.WECHAT_REDIRECT_URI || 'http://mp.ihuhao.com/edge-api/auth/wechat/callback',
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

// 生成简单的 JWT token
export function generateToken(payload, env) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const signature = btoa(
    JSON.stringify({
      data: `${encodedHeader}.${encodedPayload}`,
      secret: env.JWT_SECRET_KEY
    })
  );
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 验证 JWT token
export function verifyToken(token, env) {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    const expectedSignature = btoa(
      JSON.stringify({
        data: `${encodedHeader}.${encodedPayload}`,
        secret: jwtSecret
      })
    );
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(atob(encodedPayload));
    
    // 检查 token 是否过期
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    
    return payload;
  } catch (err) {
    console.error('Token 验证失败:', err);
    return null;
  }
}