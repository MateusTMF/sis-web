"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, Trash2 } from "lucide-react"
import type { ProjetoTecnico } from "@/lib/types/projeto"

interface FormCadastroProjeto {
  onSalvar: (projeto: ProjetoTecnico) => void
  projetoInicial?: ProjetoTecnico
}

const [projeto, setProjeto] = useState<ProjetoTecnico>(
  projetoInicial || {
    id: "",
    numero: "",
    nome: "",
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    potencia: 0,
    classe: 0, // ✅ número
    tipoTransformador: "",
    fases: 3,
    frequencia: 60,
    tensaoATPrimaria: 0,
    tensaoBT: 0,
    correnteAT: 0,
    correnteBT: 0,
    tipNucleo: "",
    materialNucleo: "",
    pesNucleo: 0,
    tipoFioAT: "",
    diametroFioAT: 0,
    numeroEspirasAT: 0,
    numeroCapasAT: 0,
    secoFioAT: 0,
    pesoFioAT: 0,
    tipoFioBT: "",
    diametroFioBT: 0,
    numeroEspirasBT: 0,
    numeroCapasBT: 0,
    secoFioBT: 0,
    pesoFioBT: 0,
    tipoTanque: "",
    materialtanque: "",
    alturaTanque: 0,
    largatanque: 0,
    profundidadeTanque: 0,
    pesoTanque: 0,
    volumeOleo: 0,
    nivelOleo: 0,
    massaTotalTrafo: 0,
    perda: 0,
    impedancia: 0,
    temperatura: 0,
    norma: "",
    desenhos: [],
    observacoes: "",
    especificacoes: "",
  }
)


  const [desenhos, setDesenhos] = useState<File[]>([])

  const handleInputChange = (field: keyof ProjetoTecnico, value: any) => {
    setProjeto((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDesenhoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDesenhos((prev) => [...prev, ...files])
  }

  const handleRemoverDesenho = (index: number) => {
    setDesenhos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSalvar = () => {
    onSalvar(projeto)
  }

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="gerais" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gerais">Dados Gerais</TabsTrigger>
          <TabsTrigger value="eletricos">Dados Elétricos</TabsTrigger>
          <TabsTrigger value="enrolamentos">Enrolamentos</TabsTrigger>
          <TabsTrigger value="desenhos">Desenhos</TabsTrigger>
        </TabsList>

        {/* Dados Gerais */}
        <TabsContent value="gerais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais do Projeto</CardTitle>
              <CardDescription>Identificação e especificações básicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero">Número do Projeto</Label>
                  <Input
                    id="numero"
                    placeholder="Ex: 3075/ALM3/24"
                    value={projeto.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="nome">Nome do Projeto</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Trafo 75KVA"
                    value={projeto.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="potencia">Potência (KVA)</Label>
                  <Input
                    id="potencia"
                    type="number"
                    placeholder="75"
                    value={projeto.potencia}
                    onChange={(e) => handleInputChange("potencia", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="classe">Classe (KV)</Label>
                  <Input
                    id="classe"
                    type="number"
                    placeholder="15"
                    value={projeto.classe}
                    onChange={(e) => handleInputChange("classe", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fases">Fases</Label>
                  <Select
                    value={projeto.fases.toString()}
                    onValueChange={(v) => handleInputChange("fases", Number.parseInt(v))}
                  >
                    <SelectTrigger id="fases">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Monofásico</SelectItem>
                      <SelectItem value="3">Trifásico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequencia">Frequência (Hz)</Label>
                  <Input
                    id="frequencia"
                    type="number"
                    placeholder="60"
                    value={projeto.frequencia}
                    onChange={(e) => handleInputChange("frequencia", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Transformador</Label>
                  <Input
                    id="tipo"
                    placeholder="Ex: Transformador a Óleo"
                    value={projeto.tipoTransformador}
                    onChange={(e) => handleInputChange("tipoTransformador", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="norma">Norma</Label>
                  <Input
                    id="norma"
                    placeholder="Ex: ABNT, IEC"
                    value={projeto.norma}
                    onChange={(e) => handleInputChange("norma", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="especificacoes">Especificações</Label>
                <Textarea
                  id="especificacoes"
                  placeholder="Descreva as especificações técnicas..."
                  value={projeto.especificacoes}
                  onChange={(e) => handleInputChange("especificacoes", e.target.value)}
                  className="h-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dados Elétricos */}
        <TabsContent value="eletricos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Elétricos</CardTitle>
              <CardDescription>Especificações de tensão e corrente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tensão AT Primária (V)</Label>
                  <Input
                    type="number"
                    placeholder="13800"
                    value={projeto.tensaoATPrimaria}
                    onChange={(e) => handleInputChange("tensaoATPrimaria", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Tensão AT Secundária (V)</Label>
                  <Input
                    type="number"
                    placeholder="Opcional"
                    value={projeto.tensaoATSecundaria || ""}
                    onChange={(e) => handleInputChange("tensaoATSecundaria", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Tensão BT (V)</Label>
                  <Input
                    type="number"
                    placeholder="380"
                    value={projeto.tensaoBT}
                    onChange={(e) => handleInputChange("tensaoBT", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Corrente AT (A)</Label>
                  <Input
                    type="number"
                    placeholder="3.14"
                    value={projeto.correnteAT}
                    onChange={(e) => handleInputChange("correnteAT", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Corrente BT (A)</Label>
                  <Input
                    type="number"
                    placeholder="113.95"
                    value={projeto.correnteBT}
                    onChange={(e) => handleInputChange("correnteBT", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Perda (W)</Label>
                  <Input
                    type="number"
                    value={projeto.perda}
                    onChange={(e) => handleInputChange("perda", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Impedância (%)</Label>
                  <Input
                    type="number"
                    value={projeto.impedancia}
                    onChange={(e) => handleInputChange("impedancia", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Temperatura (°C)</Label>
                  <Input
                    type="number"
                    value={projeto.temperatura}
                    onChange={(e) => handleInputChange("temperatura", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Núcleo</Label>
                  <Input
                    placeholder="Ex: Núcleo de Ferro"
                    value={projeto.tipNucleo}
                    onChange={(e) => handleInputChange("tipNucleo", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Material Núcleo</Label>
                  <Input
                    placeholder="Ex: Aço Silício"
                    value={projeto.materialNucleo}
                    onChange={(e) => handleInputChange("materialNucleo", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Peso Núcleo (kg)</Label>
                <Input
                  type="number"
                  value={projeto.pesNucleo}
                  onChange={(e) => handleInputChange("pesNucleo", Number.parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrolamentos */}
        <TabsContent value="enrolamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolamento AT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Fio</Label>
                  <Input
                    placeholder="Ex: ALUMINIO"
                    value={projeto.tipoFioAT}
                    onChange={(e) => handleInputChange("tipoFioAT", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Diâmetro (mm)</Label>
                  <Input
                    type="number"
                    value={projeto.diametroFioAT}
                    onChange={(e) => handleInputChange("diametroFioAT", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Número de Espiras</Label>
                  <Input
                    type="number"
                    value={projeto.numeroEspirasAT}
                    onChange={(e) => handleInputChange("numeroEspirasAT", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Número de Capas</Label>
                  <Input
                    type="number"
                    value={projeto.numeroCapasAT}
                    onChange={(e) => handleInputChange("numeroCapasAT", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Seção (mm²)</Label>
                  <Input
                    type="number"
                    value={projeto.secoFioAT}
                    onChange={(e) => handleInputChange("secoFioAT", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    value={projeto.pesoFioAT}
                    onChange={(e) => handleInputChange("pesoFioAT", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enrolamento BT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Fio</Label>
                  <Input
                    placeholder="Ex: ALUMINIO"
                    value={projeto.tipoFioBT}
                    onChange={(e) => handleInputChange("tipoFioBT", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Diâmetro (mm)</Label>
                  <Input
                    type="number"
                    value={projeto.diametroFioBT}
                    onChange={(e) => handleInputChange("diametroFioBT", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Número de Espiras</Label>
                  <Input
                    type="number"
                    value={projeto.numeroEspirasBT}
                    onChange={(e) => handleInputChange("numeroEspirasBT", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Número de Capas</Label>
                  <Input
                    type="number"
                    value={projeto.numeroCapasBT}
                    onChange={(e) => handleInputChange("numeroCapasBT", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Seção (mm²)</Label>
                  <Input
                    type="number"
                    value={projeto.secoFioBT}
                    onChange={(e) => handleInputChange("secoFioBT", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    value={projeto.pesoFioBT}
                    onChange={(e) => handleInputChange("pesoFioBT", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tanque e Massa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Tanque</Label>
                  <Input
                    placeholder="Ex: Oval"
                    value={projeto.tipoTanque}
                    onChange={(e) => handleInputChange("tipoTanque", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Material Tanque</Label>
                  <Input
                    placeholder="Ex: Aço"
                    value={projeto.materialtanque}
                    onChange={(e) => handleInputChange("materialtanque", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Altura (mm)</Label>
                  <Input
                    type="number"
                    value={projeto.alturaTanque}
                    onChange={(e) => handleInputChange("alturaTanque", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Largura (mm)</Label>
                  <Input
                    type="number"
                    value={projeto.largatanque}
                    onChange={(e) => handleInputChange("largatanque", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Profundidade (mm)</Label>
                  <Input
                    type="number"
                    value={projeto.profundidadeTanque}
                    onChange={(e) => handleInputChange("profundidadeTanque", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Peso Tanque (kg)</Label>
                  <Input
                    type="number"
                    value={projeto.pesoTanque}
                    onChange={(e) => handleInputChange("pesoTanque", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Volume de Óleo (L)</Label>
                  <Input
                    type="number"
                    value={projeto.volumeOleo}
                    onChange={(e) => handleInputChange("volumeOleo", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Nível Óleo (cm)</Label>
                  <Input
                    type="number"
                    value={projeto.nivelOleo}
                    onChange={(e) => handleInputChange("nivelOleo", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Massa Total (kg)</Label>
                  <Input
                    type="number"
                    value={projeto.massaTotalTrafo}
                    onChange={(e) => handleInputChange("massaTotalTrafo", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Desenhos */}
        <TabsContent value="desenhos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desenhos e Documentação</CardTitle>
              <CardDescription>Faça upload dos desenhos técnicos e documentação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium">Arraste arquivos ou clique para fazer upload</p>
                  <input type="file" multiple onChange={handleDesenhoUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Selecionar Arquivos</span>
                    </Button>
                  </label>
                </div>

                {desenhos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Arquivos selecionados:</p>
                    {desenhos.map((arquivo, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="text-sm">{arquivo.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoverDesenho(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Digite observações sobre o projeto..."
                  value={projeto.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  className="h-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={handleSalvar} className="flex-1" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Salvar Projeto
        </Button>
      </div>
    </div>
  )
}
