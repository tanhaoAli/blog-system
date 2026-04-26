import { useQuery } from '@tanstack/react-query';
import request from '@/utils/request';
import ReactECharts from 'echarts-for-react';

export default function AdminDashboard() {
  const { data: stats } = useQuery({ 
    queryKey: ['adminStats'], 
    queryFn: () => request.get<any, any>('/admin/stats') 
  });

  const chartOptions = {
    title: { text: '近期访问趋势', left: 'center', textStyle: { fontSize: 16, fontWeight: 'normal', color: '#475569' } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#4f46e5' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#818cf8' }, { offset: 1, color: '#e0e7ff' }]
          }
        }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const pieOptions = {
    title: { text: '文章分类占比', left: 'center', textStyle: { fontSize: 16, fontWeight: 'normal', color: '#475569' } },
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center' },
    series: [
      {
        name: '分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 18, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: [
          { value: 1048, name: '前端' },
          { value: 735, name: '后端' },
          { value: 580, name: 'AI' },
          { value: 484, name: '生活' },
          { value: 300, name: '其它' }
        ]
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">后台控制台</h1>
        <p className="text-slate-500 mt-1">欢迎回来，这是您的博客数据总览。</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="text-slate-500 text-sm font-medium">总文章数</h3>
          <p className="text-3xl font-black text-indigo-600 mt-3">{stats?.totalArticles || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="text-slate-500 text-sm font-medium">文章总阅读量</h3>
          <p className="text-3xl font-black text-emerald-600 mt-3">{stats?.totalViews || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="text-slate-500 text-sm font-medium">站点总访问量</h3>
          <p className="text-3xl font-black text-blue-600 mt-3">{stats?.totalSiteVisits || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="text-slate-500 text-sm font-medium">分类数量</h3>
          <p className="text-3xl font-black text-violet-600 mt-3">{stats?.totalCategories || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <ReactECharts option={chartOptions} style={{ height: '350px', width: '100%' }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <ReactECharts option={pieOptions} style={{ height: '350px', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
