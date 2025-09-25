<template>
  <div class="container">
    <h1 class="title">Wawa Tools</h1>
    <p class="description">实用的在线工具集合</p>
    
    <div class="tools-grid">
      <NuxtLink to="/markdown" class="tool-card">
        <h2>Markdown 预览</h2>
        <p>实时预览和编辑 Markdown 文档</p>
      </NuxtLink>
      
      <NuxtLink to="/json" class="tool-card">
        <h2>JSON 格式化</h2>
        <p>格式化和验证 JSON 数据</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.description {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 3rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.tool-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.tool-card h2 {
  margin-top: 0;
  color: #3498db;
}

.tool-card p {
  color: #7f8c8d;
}
</style>