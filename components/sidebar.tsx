"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  Users,
  Factory,
  FileText,
  Package,
  ShoppingCart,
  DollarSign,
  BookOpen,
  Receipt,
  FlaskConical,
  Box,
  Store,
  UserCheck,
  Search,
  BarChart3,
  Shield,
  Plug,
  Cog,
  HelpCircle,
  Crown,
  ChevronDown,
} from "lucide-react"
import { Button } from "./ui/button"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    {
      label: "Dashboard Principal",
      href: "/",
      icon: LayoutDashboard,
      submenu: [
        { label: "Visão Geral da Fábrica", href: "/" },
        { label: "KPIs e Indicadores", href: "/dashboard/kpis" },
        { label: "Alertas do Sistema", href: "/dashboard/alertas" },
        { label: "Status de Produção e Estoque", href: "/dashboard/status" },
      ],
    },
    {
      label: "Usuários e Perfis",
      href: "/usuarios",
      icon: Users,
      submenu: [
        { label: "Cadastro de Usuários", href: "/usuarios/cadastro" },
        { label: "Perfis e Permissões", href: "/usuarios/perfis" },
        { label: "Logs e Auditoria de Ações", href: "/usuarios/logs" },
        { label: "Configurações de Acesso", href: "/usuarios/acesso" },
      ],
    },
    {
      label: "Produção",
      href: "/producao",
      icon: Factory,
      submenu: [
      { label: "Dashboard", href: "/producao/dashboard" },
        { label: "Planejamento de Produção", href: "/producao/planejamento" },
        { label: "Cadastro de Projetos", href: "/producao/projetos" },
        { label: "Ordens de Produção (OP)", href: "/producao/ordens-producao" },

        // Setores
        { label: "Núcleo", href: "/producao/nucleo" },
        { label: "Alta Tensão", href: "/producao/alta-tensao" },
        { label: "Baixa Tensão", href: "/producao/baixa-tensao" },
        { label: "Elétrica", href: "/producao/eletrica" },
        { label: "Laboratório", href: "/producao/laboratorio" },
        { label: "Pintura", href: "/producao/pintura" },
        { label: "Montagem Final", href: "/producao/montagem-final" },

        // Processos
        { label: "Controle de Processos", href: "/producao/processos" },
      ],
    },
    {
      label: "Solicitações Internas",
      href: "/solicitacoes",
      icon: FileText,
      submenu: [
        { label: "Nova Solicitação de Materiais", href: "/solicitacoes/nova" },
        { label: "Aprovação de Solicitações", href: "/solicitacoes/aprovacao" },
        { label: "Histórico de Solicitações", href: "/solicitacoes/historico" },
        { label: "Status (pendente / aprovada / atendida)", href: "/solicitacoes/status" },
        { label: "Relatórios de Solicitação", href: "/solicitacoes/relatorios" },
      ],
    },
    {
      label: "Materiais e Estoque",
      href: "/materiais",
      icon: Package,
      submenu: [
        { label: "Cadastro de Itens e Insumos", href: "/materiais/cadastro" },
        { label: "Movimentação de Estoque", href: "/materiais/movimentacao" },
        { label: "Entradas", href: "/materiais/entradas" },
        { label: "Saídas", href: "/materiais/saidas" },
        { label: "Ajustes e Perdas", href: "/materiais/ajustes" },
        { label: "Alertas de Reposição (Min/Max)", href: "/materiais/alertas" },
        { label: "Estoque Atual por Local", href: "/materiais/estoque-local" },
        { label: "Integração com Produção e Compras", href: "/materiais/integracao" },
      ],
    },
    {
      label: "Compras",
      href: "/compras",
      icon: ShoppingCart,
      submenu: [
        { label: "Requisições de Compra", href: "/compras/requisicoes" },
        { label: "Cotações de Fornecedores", href: "/compras/cotacoes" },
        { label: "Pedidos de Compra", href: "/compras/pedidos" },
        { label: "Entrada de NF-e de Compra", href: "/compras/nfe-entrada/notas" },
        { label: "Conferência de Itens", href: "/compras/conferencia" },
        { label: "Pagamentos a Fornecedores", href: "/compras/pagamentos" },
        { label: "Relatórios de Compras e Custos", href: "/compras/relatorios" },
      ],
    },
    {
      label: "Financeiro",
      href: "/financeiro",
      icon: DollarSign,
      submenu: [
        { label: "Contas a Pagar", href: "/financeiro/pagar" },
        { label: "Contas a Receber", href: "/financeiro/receber" },
        { label: "Fluxo de Caixa", href: "/financeiro/fluxo" },
        { label: "Conciliação Bancária", href: "/financeiro/conciliacao" },
        { label: "Centros de Custo", href: "/financeiro/centros-custo" },
        { label: "Relatórios Financeiros", href: "/financeiro/relatorios" },
      ],
    },
    {
      label: "Contábil",
      href: "/contabil",
      icon: BookOpen,
      submenu: [
        { label: "Plano de Contas", href: "/contabil/plano-contas" },
        { label: "Lançamentos Automáticos", href: "/contabil/lancamentos" },
        { label: "DRE, Balancete e Razão", href: "/contabil/dre" },
        { label: "Integração Fiscal e Financeira", href: "/contabil/integracao" },
        { label: "Relatórios Contábeis", href: "/contabil/relatorios" },
      ],
    },
    {
      label: "Fiscal",
      href: "/fiscal",
      icon: Receipt,
      submenu: [
        { label: "Emissão de NF-e e NFC-e", href: "/fiscal/emissao" },
        { label: "Gestão de ICMS, IPI, PIS/COFINS", href: "/fiscal/impostos" },
        { label: "SPED Fiscal e Contribuições", href: "/fiscal/sped" },
        { label: "Obrigações Acessórias", href: "/fiscal/obrigacoes" },
        { label: "Auditoria Fiscal", href: "/fiscal/auditoria" },
        { label: "Relatórios de Apuração e Tributos", href: "/fiscal/relatorios" },
      ],
    },
    {
      label: "Qualidade",
      href: "/qualidade",
      icon: FlaskConical,
      submenu: [
        { label: "Testes Elétricos e Mecânicos", href: "/qualidade/testes" },
        { label: "Registro de Não Conformidades", href: "/qualidade/nao-conformidades" },
        { label: "Ações Corretivas", href: "/qualidade/acoes-corretivas" },
        { label: "Certificados de Qualidade", href: "/qualidade/certificados" },
        { label: "Indicadores de Qualidade", href: "/qualidade/indicadores" },
      ],
    },
    {
      label: "Produtos Acabados",
      href: "/produtos-acabados",
      icon: Box,
      submenu: [
        { label: "Cadastro de Produtos", href: "/produtos-acabados/cadastro" },
        { label: "Controle de Estoque Final", href: "/produtos-acabados/estoque" },
        { label: "Rastreabilidade (Lote / Série)", href: "/produtos-acabados/rastreabilidade" },
        { label: "Expedição e Entregas", href: "/produtos-acabados/expedicao" },
        { label: "Integração com Vendas e Financeiro", href: "/produtos-acabados/integracao" },
      ],
    },
    {
      label: "Comercial e Vendas",
      href: "/vendas",
      icon: Store,
      submenu: [
        { label: "Cadastro de Clientes", href: "/vendas/clientes" },
        { label: "Pedidos de Venda", href: "/vendas/pedidos" },
        { label: "Orçamentos e Cotações", href: "/vendas/orcamentos" },
        { label: "NF-e de Saída", href: "/vendas/nfe-saida" },
        { label: "Entregas e Transportadoras", href: "/vendas/entregas" },
        { label: "Relatórios de Vendas", href: "/vendas/relatorios" },
      ],
    },
    {
      label: "Recursos Humanos",
      href: "/rh",
      icon: UserCheck,
      submenu: [
        { label: "Cadastro de Funcionários", href: "/rh/funcionarios" },
        { label: "Controle de Ponto e Jornadas", href: "/rh/ponto" },
        { label: "Folha de Pagamento", href: "/rh/folha" },
        { label: "Benefícios e Férias", href: "/rh/beneficios" },
        { label: "Relatórios de RH", href: "/rh/relatorios" },
      ],
    },
    {
      label: "Rastreabilidade",
      href: "/rastreabilidade",
      icon: Search,
      submenu: [
        { label: "Consulta por Número de Série / Lote", href: "/rastreabilidade/consulta" },
        { label: "Histórico de Produção e Inspeções", href: "/rastreabilidade/historico" },
        { label: "Auditoria Completa de Produto", href: "/rastreabilidade/auditoria" },
      ],
    },
    {
      label: "Relatórios e Dashboards",
      href: "/relatorios",
      icon: BarChart3,
      submenu: [
        { label: "Indicadores Gerais", href: "/relatorios/indicadores" },
        { label: "Painel de Produção", href: "/relatorios/producao" },
        { label: "Painel Financeiro", href: "/relatorios/financeiro" },
        { label: "Painel de Compras", href: "/relatorios/compras" },
        { label: "Painel de Estoque", href: "/relatorios/estoque" },
        { label: "Painel de Qualidade", href: "/relatorios/qualidade" },
        { label: "Exportação (PDF / Excel)", href: "/relatorios/exportacao" },
      ],
    },
    {
      label: "Segurança e Administração",
      href: "/seguranca",
      icon: Shield,
      submenu: [
        { label: "Controle de Acesso", href: "/seguranca/acesso" },
        { label: "Logs de Ações", href: "/seguranca/logs" },
        { label: "Backup e Recuperação", href: "/seguranca/backup" },
        { label: "Auditoria de Sistema", href: "/seguranca/auditoria" },
        { label: "Parâmetros Globais", href: "/seguranca/parametros" },
      ],
    },
    {
      label: "Integrações",
      href: "/integracoes",
      icon: Plug,
      submenu: [
        { label: "Fornecedores (NF-e, pedidos)", href: "/integracoes/fornecedores" },
        { label: "Clientes (pedidos e notas)", href: "/integracoes/clientes" },
        { label: "Bancos e Pagamentos", href: "/integracoes/bancos" },
        { label: "Sistemas de Transporte", href: "/integracoes/transporte" },
        { label: "APIs Internas e Externas", href: "/integracoes/apis" },
      ],
    },
    {
      label: "Configurações do Sistema",
      href: "/configuracoes",
      icon: Cog,
      submenu: [
        { label: "Parâmetros Gerais", href: "/configuracoes/parametros" },
        { label: "Layouts de Impressão / NF", href: "/configuracoes/layouts" },
        { label: "E-mails Automáticos", href: "/configuracoes/emails" },
        { label: "Agendamentos e Rotinas", href: "/configuracoes/agendamentos" },
        { label: "Integrações API (Supabase / Render)", href: "/configuracoes/api" },
      ],
    },
    {
      label: "Suporte e Documentação",
      href: "/suporte",
      icon: HelpCircle,
      submenu: [
        { label: "Central de Ajuda", href: "/suporte/central" },
        { label: "Contato Técnico", href: "/suporte/contato" },
        { label: "Atualizações do Sistema", href: "/suporte/atualizacoes" },
        { label: "Procedimentos Padrão (POP)", href: "/suporte/procedimentos" },
        { label: "Documentação Interna", href: "/suporte/documentacao" },
      ],
    },
    {
      label: "Modo Administrador",
      href: "/admin",
      icon: Crown,
      submenu: [
        { label: "Gerenciamento de Módulos", href: "/admin/modulos" },
        { label: "Atualizações e Deploy", href: "/admin/deploy" },
        { label: "Monitoramento de Servidor", href: "/admin/monitoramento" },
        { label: "Logs Técnicos e Backups", href: "/admin/logs" },
      ],
    },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpandedMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  return (
    <>
      {/* Desktop e Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-sidebar-border mt-14">
            <h1 className="text-xl font-bold text-sidebar-primary">ERP Fábrica</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Sistema Completo</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isExpanded = expandedMenu === item.label

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
                  >
                    <IconComponent size={18} className="flex-shrink-0" />
                    <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded && item.submenu && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-accent/30 pl-3">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="flex items-center px-3 py-1.5 rounded text-xs text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm h-9">
              <Settings size={16} className="mr-3"/>
              <Link href="/configuracoes/sistema">
              Configurações
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm h-9"
            >
              <LogOut size={16} className="mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
