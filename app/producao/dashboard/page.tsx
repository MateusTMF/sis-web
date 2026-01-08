"use client"

import PageLayout from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Construction, ArrowLeft } from "lucide-react"

export default function EmConstrucaoPage() {
  return (
    <PageLayout
      title="Página em Construção"
      description="Estamos trabalhando para disponibilizar esta funcionalidade em breve"
    >
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12 space-y-6">
            <div className="flex justify-center">
              <Construction className="h-16 w-16 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Em Construção</h2>
              <p className="text-muted-foreground">
                Esta funcionalidade ainda está sendo desenvolvida.
                Em breve ela estará disponível no sistema.
              </p>
            </div>

            <div className="flex justify-center">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
