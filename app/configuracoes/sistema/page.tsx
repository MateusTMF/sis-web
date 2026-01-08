"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Bell, Shield, Globe } from "lucide-react"
import Sidebar from "@/components/sidebar"

export default function ConfiguracoesSistema() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-10 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-2">Gerencie as configurações gerais da aplicação</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Nome da Empresa</Label>
              <Input id="empresa" placeholder="Digite o nome da empresa" defaultValue="Minha Empresa Ltda" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-90" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Principal</Label>
              <Input id="email" type="email" placeholder="contato@empresa.com" defaultValue="contato@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" placeholder="(00) 0000-0000" defaultValue="(11) 3456-7890" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localização e Idioma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma do Sistema</Label>
              <Input id="idioma" defaultValue="Português (Brasil)" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Input id="timezone" defaultValue="America/Sao_Paulo (GMT-3)" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moeda">Moeda</Label>
              <Input id="moeda" defaultValue="Real (BRL)" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formato">Formato de Data</Label>
              <Input id="formato" defaultValue="DD/MM/YYYY" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">Receber alertas por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">Alertas no navegador</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Automáticos</Label>
                <p className="text-sm text-muted-foreground">Envio diário de relatórios</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">Segurança adicional no login</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sessão Automática</Label>
                <p className="text-sm text-muted-foreground">Logout após inatividade</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Logs de Auditoria</Label>
                <p className="text-sm text-muted-foreground">Registrar todas as ações</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
