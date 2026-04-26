import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import request from '@/utils/request';

// Client Layouts & Pages
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import ArticleDetail from '@/pages/ArticleDetail';
import CategoryDetail from '@/pages/CategoryDetail';

// Admin Layouts & Pages
import AdminLayout from '@/layouts/AdminLayout';
import PublishArticle from '@/pages/admin/PublishArticle';
import TagManagement from '@/pages/admin/TagManagement';
import ArticleManagement from '@/pages/admin/ArticleManagement';
import UserManagement from '@/pages/admin/UserManagement';
import AdminRoute from '@/components/AdminRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="article/:id" element={<ArticleDetail />} />
            <Route path="category/:name" element={<CategoryDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<ArticleManagement />} />
            <Route path="publish" element={<PublishArticle />} />
            <Route path="tags" element={<TagManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;