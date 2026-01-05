"use client"

import Sidebar from "../../../components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Search, FileText, Eye } from "lucide-react"
import { useState } from "react"

type NfeEntrada = {
  id: number
  numero: string
  serie: string
  chave: string
  dataEmissao: string
  fornecedor: string
  cnpj: string
  valor: number
  status: string
}

const notasMock: NfeEntrada[] = [
  {
    id: 1,
    numero: "101794",
    serie: "3",
    chave: "35251218237962000124550030001017941001018020",
    dataEmissao: "2025-12-15",
    fornecedor: "CONTATTOS MAIS LTDA",
    cnpj: "18.237.962/0001-24",
    valor: 606.55,
    status: "Autorizada",
  },
  {
    id: 2,
    numero: "98541",
    serie: "1",
    chave: "35241199887766000123550010000985411000985412",
    dataEmissao: "2025-11-28",
    fornecedor: "PARAFUSOS BRASIL",
    cnpj: "45.678.901/0001-23",
    valor: 1240.9,
    status: "Autorizada",
  },
  {
    id: 3,
    numero: "33211",
    serie: "2",
    chave: "35241011223344000199550020000332111000332118",
    dataEmissao: "2025-10-10",
    fornecedor: "TINTAS PREMIUM",
    cnpj: "23.456.789/0001-01",
    valor: 389.2,
    status: "Cancelada",
  },
]

export default function ListaNfeEntrada() {
  const [filtro, setFiltro] = useState("")

  const notasFiltradas = notasMock.filter(
    (n) =>
      n.numero.includes(filtro) ||
      n.fornecedor.toLowerCase().includes(filtro.toLowerCase()) ||
      n.cnpj.includes(filtro) ||
      n.chave.includes(filtro)
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-0 md:pl-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">NF-e de Entrada</h1>
              <p className="text-muted-foreground">
                Notas fiscais de entrada importadas via XML
              </p>
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nova Importação XML
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Número da NF"
                onChange={(e) => setFiltro(e.target.value)}
              />
              <Input placeholder="Série" />
              <Input placeholder="Fornecedor" />
              <Input placeholder="CNPJ" />

              <Input placeholder="Chave da NF-e" className="md:col-span-2" />
              <Input type="date" />
              <Input type="date" />

              <Input placeholder="Valor mínimo" />
              <Input placeholder="Valor máximo" />
              <Input placeholder="Status (Autorizada, Cancelada)" />
            </CardContent>
          </Card>

          {/* Listagem */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Encontradas</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">NF</th>
                    <th className="text-left p-2">Série</th>
                    <th className="text-left p-2">Fornecedor</th>
                    <th className="text-left p-2">CNPJ</th>
                    <th className="text-left p-2">Emissão</th>
                    <th className="text-left p-2">Valor</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-right p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {notasFiltradas.map((nota) => (
                    <tr key={nota.id} className="border-b hover:bg-muted">
                      <td className="p-2">{nota.numero}</td>
                      <td className="p-2">{nota.serie}</td>
                      <td className="p-2">{nota.fornecedor}</td>
                      <td className="p-2">{nota.cnpj}</td>
                      <td className="p-2">{nota.dataEmissao}</td>
                      <td className="p-2">
                        R$ {nota.valor.toFixed(2)}
                      </td>
                      <td
                        className={`p-2 font-medium ${
                          nota.status === "Autorizada"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {nota.status}
                      </td>
                      <td className="p-2 text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
