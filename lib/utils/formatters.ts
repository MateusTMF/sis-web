// Funções de formatação para exibição de dados

export function formatarCNPJ(cnpj: string): string {
  if (!cnpj) return ""
  const numeros = cnpj.replace(/\D/g, "")
  if (numeros.length === 11) {
    // CPF
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }
  if (numeros.length === 14) {
    // CNPJ
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }
  return cnpj
}

export function formatarMoeda(valor: number): string {
  if (isNaN(valor)) return "R$ 0,00"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

export function formatarData(dataString: string): string {
  if (!dataString) return ""
  try {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data)
  } catch {
    return dataString
  }
}

export function formatarDataCurta(dataString: string): string {
  if (!dataString) return ""
  try {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data)
  } catch {
    return dataString
  }
}

export function formatarNumero(valor: number, decimais = 2): string {
  if (isNaN(valor)) return "0"
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(valor)
}

export function formatarPeso(valor: number | string): string {
  const num = typeof valor === "string" ? Number.parseFloat(valor) : valor
  if (isNaN(num)) return "0 kg"
  return `${formatarNumero(num, 3)} kg`
}

export function formatarQuantidade(valor: number | string, unidade: string): string {
  const num = typeof valor === "string" ? Number.parseFloat(valor) : valor
  if (isNaN(num)) return `0 ${unidade}`
  return `${formatarNumero(num, 4)} ${unidade}`
}
