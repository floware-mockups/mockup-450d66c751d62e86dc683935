// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("UdienzaQuadro");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("UdienzaQuadro");
import { useState, useEffect } from "react";
import { Card, Button, useTable, usePrototype, type SectionProps } from "../floware";

export default function UdienzaQuadro({ pageId }: SectionProps) {__mk();
  const table = useTable(pageId);
  const { openDetail } = usePrototype();
  const [adesso, setAdesso] = useState(() => (__mk(), Date.now()));
  useEffect(() => {__mk();
    let attivo = true;
    setTimeout(() => {__mk(); if (attivo) setAdesso(Date.now()); }, 1000);
    return () => {__mk(); attivo = false; };
  }, [adesso]);
  if (!table || table.column("Data udienza") < 0) return <p>Colonna Data udienza non disponibile.</p>;
  const oggi = new Date(adesso);
  oggi.setHours(0, 0, 0, 0);
  const limite = new Date(oggi.getTime());
  limite.setDate(limite.getDate() + 7);
  const udienza = table.column("Data udienza");
  const tipo = table.column("Tipo");
  function imminente(riga: string[]) {__mk();
    const testo = String(riga[udienza] || "").trim();
    const italiana = testo.includes("/");
    const parti = italiana ? testo.split("/") : testo.split("-");
    const giorno = Number(italiana ? parti[0] : parti[2]);
    const mese = Number(parti[1]);
    const anno = Number(italiana ? parti[2] : parti[0]);
    const data = new Date(anno, mese - 1, giorno);
    const valida = parti.length === 3 && data.getFullYear() === anno && data.getMonth() === mese - 1 && data.getDate() === giorno;
    const ricorso = tipo < 0 || String(riga[tipo]).trim().toLowerCase() === "ricorso";
    return ricorso && valida && data.getTime() >= oggi.getTime() && data.getTime() <= limite.getTime();
  }
  return <Card title="Ricorsi e udienze imminenti">
    <p className="text-sm text-(--mk-muted) mb-3">In rosso: udienze da oggi al {limite.toLocaleDateString("it-IT")}, incluse. Le date trascorse sono escluse. Controllo automatico della data corrente.</p>
    <div className="overflow-x-auto"><table className="w-full text-sm text-left">
      <thead><tr>{table.columns.map((colonna) => (__mk(), <th key={colonna} className="p-2 border-b border-(--mk-border)">{colonna}</th>))}<th className="p-2">Dettaglio</th></tr></thead>
      <tbody>{table.rows.map((riga, indice) => {__mk();
        const vicina = imminente(riga);
        return <tr key={indice} className={vicina ? "text-(--mk-danger) font-semibold" : "text-(--mk-text)"}>
          {table.columns.map((colonna, posizione) => (__mk(), <td key={colonna} className="p-2 border-b border-(--mk-divider)">{riga[posizione]}{vicina && posizione === udienza && <span className="block text-xs">Udienza imminente</span>}</td>))}
          <td className="p-2 border-b border-(--mk-divider)"><Button variant="link" onClick={() => (__mk(), openDetail(pageId, indice))}>Apri</Button></td>
        </tr>;
      })}</tbody>
    </table></div>
    {table.rows.length === 0 && <p>Nessun ricorso presente.</p>}
  </Card>;
}
