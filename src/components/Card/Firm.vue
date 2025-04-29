<template>
  <div class="container">
    <div class="card-container" v-if="!isLoading">
      <ElCard
          v-for="(item, index) in tableData"
          :key="index"
          class="job-card"
          @click="goToJobDetail(item.id)">
        <div class="job-header">
          <h2 class="job-title">{{ item.jobTitle }}</h2>
          <span class="job-company">{{ item.companyName }}</span>
        </div>
        <div class="job-details">
          <p class="job-location"><i class="icon-location"></i>{{ item.location }}</p>
          <p class="job-salary"><i class="icon-salary"></i>{{ item.salaryRange }}</p>
          <p class="job-experience"><i class="icon-experience"></i> {{ item.experience }}</p>
          <p class="job-education"><i class="icon-degree"></i> {{ item.degree }}</p>
        </div>
        <div class="job-description">
          <h3>岗位描述</h3>
          <p class="ellipsis">{{ item.description }}</p>
        </div>

        <div class="job-requirements">
          <h3>福利</h3>
          <p>{{ item.welfare }}</p>
        </div>

        <div class="job-tags">
          <el-tag
              v-for="(skill, skillIndex) in item.skill.split(' ')"
              :key="skillIndex"
              effect="plain"
              size="large"
              round>
            {{ skill }}
          </el-tag>
        </div>
      </ElCard>
    </div>
    <el-skeleton v-else-if="isLoading" :rows="5" animated/>

    <div class="page">
      <el-pagination size="large"
                     :current-page="pageNum"
                     :page-size="pageSize"
                     :total="total"
                     :page-sizes="[10, 20, 30]"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handlePageSizeChange"
                     @current-change="handleCurrentPageChange">
      </el-pagination>
    </div>


  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ElPagination, ElCard, ElTag} from 'element-plus';
import {useRouter} from 'vue-router';
import service from "@/utils/axios.js";
// 注册组件
const components = {ElPagination, ElCard};

// 响应式数据
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);
const router = useRouter();
const isLoading = ref(false);

// 初始化加载数据
onMounted(() => {
  fetchData();
});

// 获取数据函数
const fetchData = async () => {
  isLoading.value = true;
  try {
    const url = 'http://zhitutuijian.xyz/job/page';
    const response = await service.post(url, null, {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // 解析分页数据
    const {records, total: totalCount} = response.data;
    tableData.value = records;
    total.value = totalCount;
  } catch (error) {
    console.error('请求出错:', error);
    // 这里可以添加错误提示（如 ElMessage）
  } finally {
    isLoading.value = false;
  }
};
// 分页大小变化处理
const handlePageSizeChange = (size) => {
  pageSize.value = size;
  pageNum.value = 1; // 切换页大小后重置为第一页
  fetchData();
};
// 当前页变化处理
const handleCurrentPageChange = (current) => {
  pageNum.value = current;
  fetchData();
};
// 跳转到详情页
const goToJobDetail = (id) => {
  router.push({name: 'JobDetail', params: {id}});
};
</script>

<style scoped>
.container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex; /* 新增 flex 布局 */
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 子元素水平居中 */
}

.el-pagination {
  margin: 20px 0;
}
.card-container {
  display: block;
  flex-wrap: wrap;
  gap: 1.5em;
  justify-content: center;
  width: min(1500px, 100%);
  columns: 3 400px;
  column-gap: 1em;
}

.job-card {
  display: block;
  margin-bottom: 1em;
  width: 420px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  transition: transform 0.3s ease-in-out;
}

.job-card:hover {
  transform: translateY(-2px);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  box-shadow: 0 10px 50px 30px rgba(108, 129, 152, 0.18);
}


.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
}

.job-title {
  font-size: 1.4rem;
  color: #2c3e50;
}

.job-company {
  font-size: 0.9rem;
  color: #7f8c8d;
  background-color: #ecf0f1;
  padding: 4px 8px;
  border-radius: 4px;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.job-location, .job-salary, .job-experience, .job-education {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.job-description, .job-requirements {
  overflow: hidden;
  -webkit-line-clamp: 2; /* 限制显示的行数 */
}

.ellipsis {
  display: -webkit-box; /* 开启弹性盒子模型 */
  -webkit-box-orient: vertical; /* 垂直排列子元素 */
  -webkit-line-clamp: 2; /* 限制显示的行数 */
  overflow: hidden; /* 溢出内容隐藏 */
  line-height: 1.5; /* 可选：调整行高使布局更美观 */
}

h3 {
  font-size: 1rem;
  color: #3498db;
  martin-top: -10px;
  margin-bottom: -10px;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: -10px;
}

/* 图标样式 */
.icon-location::before {
  content: "📍";
  margin-right: 5px;
}

.icon-salary::before {
  content: "💰";
  margin-right: 5px;
}

.icon-experience::before {
  content: "⏱️";
  margin-right: 5px;
}

.icon-degree::before {
  content: "🎓";
  margin-right: 5px;
}

.page {
  position: relative;
  bottom: 0;
}

.apply-btn {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.apply-btn:hover {
  background-color: #2980b9;
}

.el-card > .card-footer {
  height: 100px; /* 固定 footer 高度，可根据需求调整 */
  display: flex;
  justify-content: center; /* 按钮水平居中 */
  align-items: center; /* 按钮垂直居中 */
  border-top: 1px solid #f0f2f5; /* 可选：添加底部边框 */
  background: white; /* 保持与卡片背景一致 */
}

</style>
