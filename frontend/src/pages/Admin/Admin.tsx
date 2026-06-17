import { useState } from "react";
import { Card } from "../../components/Card";
import ObrasTab from "./ObrasTab";
import ExemplaresTab from "./ExemplaresTab";
import LocalizacoesTab from "./LocalizacoesTab";
import LeitoresTab from "./LeitoresTab";
import EmprestimosTab from "./EmprestimosTab";

const tabs = [
  { id: "obras", label: "Obras" },
  { id: "exemplares", label: "Exemplares" },
  { id: "localizacoes", label: "Localizações" },
  { id: "leitores", label: "Leitores" },
  { id: "emprestimos", label: "Empréstimos" },
];

export function Admin() {
  const [activeTab, setActiveTab] = useState("obras");

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-2">Administração</h1>
        <p className="text-muted-foreground mb-6">Gerencie obras, exemplares, localizações, leitores e empréstimos</p>

        <div className="flex gap-2 border-b border-border mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card>
          {activeTab === "obras" && <ObrasTab />}
          {activeTab === "exemplares" && <ExemplaresTab />}
          {activeTab === "localizacoes" && <LocalizacoesTab />}
          {activeTab === "leitores" && <LeitoresTab />}
          {activeTab === "emprestimos" && <EmprestimosTab />}
        </Card>
      </div>
    </div>
  );
}