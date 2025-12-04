import { type ProjetoTecnico, projetoMock } from "./projeto"
import type { EtapaProducao, SetorProducao } from "./setor-producao"

// Progresso agora é calculado automaticamente com base nas etapas
export interface OrdemProducaoDetalhes {
  id: string
  numeroOP: string
  dataCriacao: string
  dataInicio?: string
  dataPrazo: string
  dataConclusao?: string

  projetoId: string
  projeto: ProjetoTecnico

  status: "aguardando" | "em-producao" | "pausada" | "concluida"
  progresso: number
  prioridade: "baixa" | "normal" | "alta" | "urgente"

  etapas: Record<SetorProducao, EtapaProducao>
  setorAtual?: SetorProducao

  operador?: string
  maquina?: string 
  secao?: string 

  observacoes: string
  anotacoes: Array<{
    id: string
    data: string
    usuario: string
    conteudo: string
  }>
}

export const ordensProducaoMockDetalhes: OrdemProducaoDetalhes[] = [
  {
    id: "op-001",
    numeroOP: "OP-2024-001",
    dataCriacao: new Date().toISOString(),
    dataPrazo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    projetoId: "proj-001",
    projeto: projetoMock[0],
    status: "em-producao",
    progresso: 55,
    prioridade: "alta",
    etapas: {
      nucleo: {
        id: "etapa-001",
        setor: "nucleo",
        status: "concluida",
        progresso: 100,
        dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        dataConclusao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        observacoes: "Núcleo montado e laminado",
        tempoEstimado: 480,
        tempoReal: 450,
      },
      "alta-tensao": {
        id: "etapa-002",
        setor: "alta-tensao",
        status: "concluida",
        progresso: 100,
        dataInicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        dataConclusao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        observacoes: "Bobinagem AT concluída com 3711 espiras",
        tempoEstimado: 720,
        tempoReal: 750,
      },
      "baixa-tensao": {
        id: "etapa-003",
        setor: "baixa-tensao",
        status: "em-progresso",
        progresso: 65,
        dataInicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        observacoes: "Bobinagem BT em andamento",
        tempoEstimado: 480,
      },
      eletrica: {
        id: "etapa-004",
        setor: "eletrica",
        status: "nao-iniciada",
        progresso: 0,
        observacoes: "",
        tempoEstimado: 240,
      },
      laboratorio: {
        id: "etapa-005",
        setor: "laboratorio",
        status: "nao-iniciada",
        progresso: 0,
        observacoes: "",
        tempoEstimado: 180,
      },
      pintura: {
        id: "etapa-006",
        setor: "pintura",
        status: "nao-iniciada",
        progresso: 0,
        observacoes: "",
        tempoEstimado: 240,
      },
      "montagem-final": {
        id: "etapa-007",
        setor: "montagem-final",
        status: "nao-iniciada",
        progresso: 0,
        observacoes: "",
        tempoEstimado: 360,
      },
    },
    setorAtual: "baixa-tensao",
    observacoes: "Ordem em andamento conforme previsto",
    anotacoes: [],
  },
]
