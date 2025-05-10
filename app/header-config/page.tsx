import { HeaderTokenizationConfig } from "@/components/header-tokenization-config"

export default function HeaderConfigPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Header Tokenization Configuration</h1>
      <p className="text-muted-foreground mb-8">
        Configure how HTTP headers are tokenized and processed in the AU-Legis-Compliant Framework
      </p>

      <HeaderTokenizationConfig />
    </div>
  )
}
