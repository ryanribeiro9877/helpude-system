import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PipelinePage } from '@/pages/PipelinePage';
import { MarketingPage } from '@/pages/MarketingPage';
import { ConsultasPage } from '@/pages/ConsultasPage';
import { ProdutosPage } from '@/pages/ProdutosPage';
import { UsuariosPage } from '@/pages/UsuariosPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-helpude-purple-50/30">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-2xl">H</span>
          </div>
          <div className="w-8 h-8 border-4 border-helpude-purple-200 border-t-helpude-purple-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="consultas" element={<ConsultasPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="relatorios" element={<ComingSoonPage title="Relatórios" />} />
        <Route path="configuracoes" element={<ComingSoonPage title="Configurações" />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Placeholder para páginas em desenvolvimento
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-helpude-purple-100 flex items-center justify-center mb-6">
        <span className="text-4xl">🚧</span>
      </div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground">
        Esta página está em desenvolvimento e estará disponível em breve.
      </p>
    </div>
  );
}

export default App;
