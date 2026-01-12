import React, { useState, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Search, Users, DollarSign, TrendingUp, Upload, CreditCard, ArrowUpRight, ChevronDown, Bell, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, CheckCircle2, MessageSquare, Phone, MessageCircle, Send, User, MoreHorizontal, Sparkles, Clock, Check, X, FileSpreadsheet, Download, Trash2, AlertCircle, Plus, Shield, ShieldCheck, Edit, UserCheck, UserX, Save, Image, Volume2, ChevronLeft, ChevronRight, LogOut, HelpCircle, BarChart3, Kanban, Settings } from 'lucide-react';

// Auth Context
const AuthContext = createContext(null);

const mockUser = {
  id: '1',
  email: 'clinica@exemplo.com',
  name: 'Dr. João Silva',
  cnpj: '12.345.678/0001-90',
  clinicName: 'Clínica Saúde Total',
  level: 1,
  consultasUsadas: 23,
  consultasLimite: 50,
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    if (email && password) {
      setUser({ ...mockUser, email });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// Utility Functions
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value);
const getInitials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// Chart Data
const chartData = [
  { date: 'Jan', consultas: 12, aprovados: 8 },
  { date: 'Fev', consultas: 19, aprovados: 14 },
  { date: 'Mar', consultas: 25, aprovados: 18 },
  { date: 'Abr', consultas: 32, aprovados: 24 },
  { date: 'Mai', consultas: 45, aprovados: 35 },
  { date: 'Jun', consultas: 38, aprovados: 28 },
];

// Products Data
const products = [
  { id: '1', name: 'Crédito para Assalariados', description: 'Crédito consignado para trabalhadores CLT', publicoNumero: 43, status: 'active', icon: '💼' },
  { id: '2', name: 'Pagamento Recorrente', description: 'Cuide da saúde pagando no cartão', publicoNumero: 95, status: 'coming_soon', icon: '💳' },
  { id: '3', name: 'Crédito via Boleto', description: 'Crédito para pessoas sem restrição', publicoNumero: 120, status: 'coming_soon', icon: '📄' },
];

// Mock Pipeline Clients
const mockClientes = [
  { id: '1', nome: 'Maria Silva', cpf: '123.456.789-01', creditoAprovado: 15000, messagesSent: false, emailOpened: false, smsReceived: false },
  { id: '2', nome: 'João Santos', cpf: '987.654.321-01', creditoAprovado: 8500, messagesSent: true, emailOpened: true, smsReceived: true },
  { id: '3', nome: 'Ana Costa', cpf: '456.789.123-01', creditoAprovado: 22000, messagesSent: true, emailOpened: false, smsReceived: true },
];

// Styles
const styles = {
  container: { fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff20 100%)' },
  sidebar: { width: 280, background: '#fff', borderRight: '1px solid #e5e7eb', height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 20px rgba(0,0,0,0.05)' },
  sidebarCollapsed: { width: 80 },
  main: { marginLeft: 280, padding: 24 },
  mainCollapsed: { marginLeft: 80 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none' },
  cardHover: { transition: 'all 0.3s', cursor: 'pointer' },
  button: { background: 'linear-gradient(135deg, #7b5fc7 0%, #5b3a9a 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(123, 95, 199, 0.3)' },
  buttonOutline: { background: 'transparent', color: '#7b5fc7', border: '2px solid #7b5fc7', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer' },
  buttonSecondary: { background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)' },
  input: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', transition: 'border 0.2s' },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  badgeSuccess: { background: '#dcfce7', color: '#166534' },
  badgeWarning: { background: '#fef3c7', color: '#92400e' },
  badgePurple: { background: '#f3e8ff', color: '#7b5fc7' },
  badgeTeal: { background: '#ccfbf1', color: '#0d9488' },
  metricCard: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7b5fc7 0%, #14b8a6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 },
  menuItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', color: '#64748b' },
  menuItemActive: { background: '#f3e8ff', color: '#7b5fc7' },
  logo: { width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7b5fc7 0%, #5b3a9a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 },
};

// Login Page Component
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('demo@clinica.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        onLogin();
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #7b5fc7 0%, #3d246c 100%)', padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={styles.logo}>H</div>
          <span style={{ fontSize: 32, fontWeight: 700 }}>HelpUde</span>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 24, lineHeight: 1.2 }}>
          Crédito para <span style={{ color: '#5eead4' }}>43 milhões</span> de brasileiros
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 32 }}>
          Conecte sua clínica ao maior ecossistema de crédito para saúde do Brasil.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Cadastro automático para CNPJ ativo', 'Consultas em lote de até 50 clientes', 'Marketing automatizado para aprovados', 'Pipeline completo de acompanhamento'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={12} color="#fff" />
              </div>
              <span style={{ opacity: 0.9 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Bem-vindo de volta</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>Entre na sua conta para continuar</p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>E-mail</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ...styles.input, paddingLeft: 40 }}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...styles.input, paddingLeft: 40, paddingRight: 40 }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" style={{ ...styles.button, width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>Ainda não tem uma conta?</p>
              <button style={{ ...styles.buttonOutline, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Building2 size={18} />
                Cadastrar minha clínica
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ activeMenu, setActiveMenu, collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'produtos', icon: CreditCard, label: 'Produtos' },
    { id: 'consultas', icon: Upload, label: 'Consultas em Lote' },
    { id: 'pipeline', icon: Kanban, label: 'Pipeline' },
    { id: 'marketing', icon: MessageSquare, label: 'Marketing' },
    { id: 'usuarios', icon: Users, label: 'Usuários' },
  ];

  return (
    <div style={{ ...styles.sidebar, ...(collapsed ? styles.sidebarCollapsed : {}) }}>
      {/* Logo */}
      <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={styles.logo}>H</div>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: 20, color: '#3d246c' }}>HelpUde</span>}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}
        >
          {collapsed ? <ChevronRight size={18} color="#64748b" /> : <ChevronLeft size={18} color="#64748b" />}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={styles.avatar}>{getInitials(user.name)}</div>
            {!collapsed && (
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{user.clinicName}</p>
                <span style={{ ...styles.badge, ...styles.badgePurple }}>Nível {user.level}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu */}
      <nav style={{ flex: 1, padding: 12, overflow: 'auto' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            style={{
              ...styles.menuItem,
              ...(activeMenu === item.id ? styles.menuItemActive : {}),
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <item.icon size={20} />
            {!collapsed && <span style={{ fontWeight: 500 }}>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
        <div
          onClick={logout}
          style={{ ...styles.menuItem, color: '#ef4444', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={20} />
          {!collapsed && <span style={{ fontWeight: 500 }}>Sair</span>}
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, format, icon: Icon, color, trend }) {
  const colors = {
    purple: { bg: '#f3e8ff', icon: '#7b5fc7' },
    teal: { bg: '#ccfbf1', icon: '#0d9488' },
    green: { bg: '#dcfce7', icon: '#16a34a' },
    orange: { bg: '#ffedd5', icon: '#ea580c' },
  };
  const c = colors[color] || colors.purple;

  const formattedValue = format === 'currency' ? formatCurrency(value) : format === 'percentage' ? `${value}%` : formatNumber(value);

  return (
    <div style={styles.metricCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{title}</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{formattedValue}</p>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, color: trend.isPositive ? '#16a34a' : '#ef4444', fontSize: 14 }}>
              <TrendingUp size={16} />
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span style={{ color: '#94a3b8' }}>vs mês anterior</span>
            </div>
          )}
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: c.bg }}>
          <Icon size={24} color={c.icon} />
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const isActive = product.status === 'active';
  
  return (
    <div style={{
      ...styles.card,
      border: isActive ? '2px solid #99f6e4' : '2px solid #e5e7eb',
      background: isActive ? 'linear-gradient(135deg, #fff 0%, #f0fdfa 100%)' : '#f9fafb',
      opacity: isActive ? 1 : 0.8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <span style={{ ...styles.badge, ...(isActive ? styles.badgeSuccess : styles.badgeWarning) }}>
          {isActive ? '✓ Ativo' : '⏳ Em Breve'}
        </span>
      </div>
      
      <div style={{ fontSize: 48, marginBottom: 16 }}>{product.icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: isActive ? '#0d9488' : '#64748b' }}>{product.name}</h3>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{product.description}</p>
      
      <div style={{ background: isActive ? '#ccfbf1' : '#f1f5f9', padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Users size={18} color={isActive ? '#0d9488' : '#94a3b8'} />
          <span style={{ fontSize: 14, color: isActive ? '#0d9488' : '#64748b' }}>Público Potencial</span>
        </div>
        <p style={{ fontSize: 24, fontWeight: 700, color: isActive ? '#0d9488' : '#64748b' }}>
          {product.publicoNumero} milhões
        </p>
      </div>

      <button style={isActive ? styles.buttonSecondary : { ...styles.buttonOutline, opacity: 0.5, cursor: 'not-allowed' }} disabled={!isActive}>
        {isActive ? 'Começar a Usar' : 'Disponível em Breve'}
      </button>
    </div>
  );
}

// Dashboard Page
function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#64748b' }}>Veja o resumo da sua clínica e acompanhe seus resultados</p>
        </div>
        <button style={styles.button}>
          <Upload size={18} />
          Subir Nova Base
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        <MetricCard title="Total de Consultas" value={user?.consultasUsadas || 0} icon={Search} color="purple" trend={{ value: 12, isPositive: true }} />
        <MetricCard title="Clientes Aprovados" value={34} icon={Users} color="teal" trend={{ value: 8, isPositive: true }} />
        <MetricCard title="Crédito Total Aprovado" value={485000} format="currency" icon={DollarSign} color="green" trend={{ value: 23, isPositive: true }} />
        <MetricCard title="Taxa de Conversão" value={68} format="percentage" icon={TrendingUp} color="orange" trend={{ value: 5, isPositive: true }} />
      </div>

      {/* Chart */}
      <div style={{ ...styles.card, marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Evolução de Consultas</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b5fc7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7b5fc7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAprovados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="consultas" stroke="#7b5fc7" strokeWidth={2} fillOpacity={1} fill="url(#colorConsultas)" />
              <Area type="monotone" dataKey="aprovados" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorAprovados)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Level Progress */}
      <div style={{ ...styles.card, marginBottom: 32, background: 'linear-gradient(135deg, #7b5fc7 0%, #14b8a6 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Sparkles size={20} />
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Sua Jornada HelpUde</h3>
        </div>
        <p style={{ opacity: 0.8, marginBottom: 24 }}>Evolua seu cadastro e desbloqueie mais benefícios</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          {[
            { level: 1, name: 'Acesso Inicial', icon: '🚀' },
            { level: 2, name: 'Cadastro Aprovado', icon: '⭐' },
            { level: 3, name: 'Análise Plena', icon: '👑' },
          ].map((l) => (
            <div key={l.level} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', margin: '0 auto 8px',
                background: l.level <= user?.level ? '#fff' : 'rgba(255,255,255,0.3)',
                color: l.level <= user?.level ? '#7b5fc7' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 18
              }}>
                {l.level < user?.level ? <Check size={20} /> : l.level}
              </div>
              <p style={{ fontSize: 12, opacity: 0.9 }}>{l.name}</p>
            </div>
          ))}
        </div>
        
        <div style={{ height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4 }}>
          <div style={{ height: '100%', width: `${((user?.level || 1) - 1) / 2 * 100}%`, background: '#fff', borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Products */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Produtos Disponíveis</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Pipeline Page
function PipelinePage() {
  const columns = [
    { id: 'approved', title: 'Crédito Aprovado', color: '#16a34a', bg: '#dcfce7', clients: mockClientes.filter(c => !c.messagesSent) },
    { id: 'contacted', title: 'Mensagem Enviada', color: '#2563eb', bg: '#dbeafe', clients: mockClientes.filter(c => c.messagesSent && !c.emailOpened) },
    { id: 'engaged', title: 'Engajamento', color: '#7b5fc7', bg: '#f3e8ff', clients: mockClientes.filter(c => c.emailOpened || c.smsReceived) },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Pipeline de Clientes</h1>
        <p style={{ color: '#64748b' }}>Acompanhe o status dos seus clientes aprovados</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {columns.map((col) => (
          <div key={col.id} style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color={col.color} />
                </div>
                <span style={{ fontWeight: 600 }}>{col.title}</span>
              </div>
              <span style={{ ...styles.badge, background: '#f1f5f9', color: '#64748b' }}>{col.clients.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.clients.map((client) => (
                <div key={client.id} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ ...styles.avatar, width: 32, height: 32, fontSize: 12 }}>{getInitials(client.nome)}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{client.nome}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{client.cpf}</p>
                    </div>
                  </div>
                  
                  <div style={{ background: '#dcfce7', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: '#16a34a' }}>Crédito Aprovado</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}>{formatCurrency(client.creditoAprovado)}</p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <div style={{ padding: 6, borderRadius: 6, background: client.emailOpened ? '#dcfce7' : '#f1f5f9' }}>
                      <Mail size={14} color={client.emailOpened ? '#16a34a' : '#94a3b8'} />
                    </div>
                    <div style={{ padding: 6, borderRadius: 6, background: client.smsReceived ? '#dcfce7' : '#f1f5f9' }}>
                      <MessageSquare size={14} color={client.smsReceived ? '#16a34a' : '#94a3b8'} />
                    </div>
                    <div style={{ padding: 6, borderRadius: 6, background: '#f1f5f9' }}>
                      <Phone size={14} color="#94a3b8" />
                    </div>
                  </div>

                  <button style={{ ...styles.buttonOutline, width: '100%', padding: '8px 16px', fontSize: 14, color: '#16a34a', borderColor: '#86efac' }}>
                    <MessageCircle size={16} style={{ marginRight: 8 }} />
                    Chamar no WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Products Page
function ProdutosPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Produtos Disponíveis</h1>
        <p style={{ color: '#64748b' }}>Explore as opções de crédito disponíveis para seus pacientes</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Consultas Page
function ConsultasPage() {
  const { user } = useAuth();
  const consultasRestantes = (user?.consultasLimite || 50) - (user?.consultasUsadas || 0);

  const mockFiles = [
    { id: '1', name: 'clientes_janeiro.xlsx', size: '245 KB', status: 'completed', results: { aprovados: 32, rejeitados: 12 } },
    { id: '2', name: 'base_fevereiro.csv', size: '180 KB', status: 'completed', results: { aprovados: 28, rejeitados: 5 } },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Consultas em Lote</h1>
          <p style={{ color: '#64748b' }}>Faça upload de até 50 registros por vez</p>
        </div>
        
        <div style={styles.card}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Consultas Disponíveis</p>
          <p style={{ fontSize: 24, fontWeight: 700 }}>
            <span style={{ color: '#7b5fc7' }}>{consultasRestantes}</span>
            <span style={{ color: '#94a3b8' }}>/{user?.consultasLimite}</span>
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div style={{ ...styles.card, border: '2px dashed #e5e7eb', textAlign: 'center', marginBottom: 32, cursor: 'pointer' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Upload size={32} color="#7b5fc7" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Arraste sua base de clientes</h3>
        <p style={{ color: '#64748b', marginBottom: 16 }}>ou clique para selecionar um arquivo</p>
        <button style={styles.buttonOutline}>
          <FileSpreadsheet size={18} style={{ marginRight: 8 }} />
          Selecionar Arquivo
        </button>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>Formatos aceitos: .xlsx, .xls, .csv • Máximo 50 registros</p>
      </div>

      {/* Files List */}
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Arquivos Processados</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockFiles.map((file) => (
          <div key={file.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={24} color="#7b5fc7" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ fontWeight: 600 }}>{file.name}</p>
                <span style={{ ...styles.badge, ...styles.badgeSuccess }}>
                  <CheckCircle2 size={12} style={{ marginRight: 4 }} />
                  Concluído
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#64748b' }}>{file.size}</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 14 }}>
                <span><b style={{ color: '#16a34a' }}>{file.results.aprovados}</b> aprovados</span>
                <span><b style={{ color: '#ef4444' }}>{file.results.rejeitados}</b> rejeitados</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}><Eye size={18} color="#64748b" /></button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}><Download size={18} color="#64748b" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Marketing Page
function MarketingPage() {
  const [activeTab, setActiveTab] = useState('rcs');

  const tabs = [
    { id: 'rcs', label: 'RCS/SMS', icon: MessageSquare },
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'voice', label: 'Ligação IA', icon: Phone },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Automação de Marketing</h1>
          <p style={{ color: '#64748b' }}>Configure mensagens automáticas para clientes aprovados</p>
        </div>
        <button style={styles.button}>
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#f1f5f9', padding: 4, borderRadius: 12, width: 'fit-content' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10,
              background: activeTab === tab.id ? '#fff' : 'transparent',
              border: 'none', cursor: 'pointer', fontWeight: 500,
              color: activeTab === tab.id ? '#7b5fc7' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeTab === 'rcs' && <><MessageSquare size={20} color="#7b5fc7" /> RCS / SMS Rich</>}
              {activeTab === 'email' && <><Mail size={20} color="#7b5fc7" /> E-mail Marketing</>}
              {activeTab === 'voice' && <><Phone size={20} color="#7b5fc7" /> Ligação com IA</>}
              {activeTab === 'whatsapp' && <><MessageCircle size={20} color="#16a34a" /> WhatsApp da Clínica</>}
            </h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>Mensagem enviada automaticamente quando o crédito é aprovado</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {activeTab === 'voice' && <span style={{ ...styles.badge, ...styles.badgeWarning }}>Em Breve</span>}
            <span style={{ fontSize: 14, color: '#64748b' }}>Ativo</span>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: activeTab === 'voice' ? '#e5e7eb' : '#7b5fc7', padding: 2, cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', marginLeft: activeTab === 'voice' ? 0 : 20, transition: 'margin 0.2s' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Editor */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Texto da Mensagem</label>
            <textarea
              style={{ ...styles.input, minHeight: 150, resize: 'none' }}
              defaultValue="Olá {nome}! Você foi pré-aprovado para um crédito de {valor}. Entre em contato conosco para cuidar da sua saúde! 💚"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {['{nome}', '{valor}', '{clinica}'].map((tag) => (
                <span key={tag} style={{ ...styles.badge, background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Preview</label>
            <div style={{ background: '#f1f5f9', borderRadius: 16, padding: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, maxWidth: 280, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <p style={{ fontSize: 14 }}>Olá Maria! Você foi pré-aprovado para um crédito de R$ 15.000,00. Entre em contato conosco para cuidar da sua saúde! 💚</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Page
function UsuariosPage() {
  const mockUsers = [
    { id: '1', name: 'Ana Carolina', email: 'ana@clinica.com', role: 'admin', active: true },
    { id: '2', name: 'Carlos Eduardo', email: 'carlos@clinica.com', role: 'operator', active: true },
    { id: '3', name: 'Mariana Silva', email: 'mariana@clinica.com', role: 'viewer', active: false },
  ];

  const roleConfig = {
    admin: { label: 'Administrador', color: '#7b5fc7', bg: '#f3e8ff' },
    operator: { label: 'Operador', color: '#2563eb', bg: '#dbeafe' },
    viewer: { label: 'Visualizador', color: '#64748b', bg: '#f1f5f9' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Gerenciamento de Usuários</h1>
          <p style={{ color: '#64748b' }}>Controle o acesso e permissões dos membros da sua equipe</p>
        </div>
        <button style={styles.button}>
          <Plus size={18} />
          Adicionar Usuário
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockUsers.map((user) => {
          const role = roleConfig[user.role];
          return (
            <div key={user.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: 16, opacity: user.active ? 1 : 0.6 }}>
              <div style={{ ...styles.avatar, width: 48, height: 48 }}>{getInitials(user.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontWeight: 600 }}>{user.name}</p>
                  <span style={{ ...styles.badge, background: role.bg, color: role.color }}>{role.label}</span>
                  {!user.active && <span style={{ ...styles.badge, background: '#f1f5f9', color: '#64748b' }}>Inativo</span>}
                </div>
                <p style={{ fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={14} /> {user.email}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}><Edit size={18} color="#64748b" /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                  {user.active ? <UserX size={18} color="#f59e0b" /> : <UserCheck size={18} color="#16a34a" />}
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}><Trash2 size={18} color="#ef4444" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardPage />;
      case 'produtos': return <ProdutosPage />;
      case 'consultas': return <ConsultasPage />;
      case 'pipeline': return <PipelinePage />;
      case 'marketing': return <MarketingPage />;
      case 'usuarios': return <UsuariosPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <AuthProvider>
      <div style={styles.container}>
        {!isLoggedIn ? (
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <>
            <Sidebar 
              activeMenu={activeMenu} 
              setActiveMenu={setActiveMenu} 
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
            <div style={{ ...(sidebarCollapsed ? styles.mainCollapsed : styles.main), transition: 'margin 0.3s' }}>
              {renderPage()}
            </div>
          </>
        )}
      </div>
    </AuthProvider>
  );
}
