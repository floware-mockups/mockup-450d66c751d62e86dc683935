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
  const [mese, setMese] = useState(() => {__mk(); const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  useEffect(() => {__mk();
    let attivo = true;
    setTimeout(() => {__mk(); if (attivo) setAdesso(Date.now()); }, 60000);
    return () => {__mk(); attivo = false; };
  }, [adesso]);
  if (!table || table.column("Data udienza") < 0) return <p>Colonna Data udienza non disponibile.</p>;
  const oggi = new Date(adesso);
  oggi.setHours(0, 0, 0, 0);
  const limite = new Date(oggi.getTime());
  limite.setDate(limite.getDate() + 5);
  const colData = table.column("Data udienza");
  const colPratica = table.column("Pratica");
  const colTipo = table.column("Tipo");
  function leggiData(testo: string) {__mk();
    const valore = String(testo || "").trim();
    const italiana = valore.includes("/");
    const parti = valore.split(italiana ? "/" : "-");
    if (parti.length !== 3) return null;
    const indiceGiorno = italiana ? 0 : 2;
    const indiceAnno = italiana ? 2 : 0;
    const giorno = Number(parti[indiceGiorno]);
    const meseData = Number(parti[1]);
    const anno = Number(parti[indiceAnno]);
    const data = new Date(anno, meseData - 1, giorno);
    return data.getFullYear() === anno && data.getMonth() === meseData - 1 && data.getDate() === giorno ? data : null;
  }
  const eventi = table.rows.map((riga, indice) => ((__mk(), { indice, data: leggiData(riga[colData]), titolo: colPratica >= 0 ? riga[colPratica] : "Ricorso", ricorso: colTipo < 0 || String(riga[colTipo]).trim().toLowerCase() === "ricorso" }))).filter((evento) => (__mk(), evento.ricorso));
  const nonValide = eventi.filter((evento) => (__mk(), !evento.data)).length;
  const inizio = new Date(mese.getFullYear(), mese.getMonth(), 1);
  const scarto = (inizio.getDay() + 6) % 7;
  const giorni = Array.from({ length: 42 }, (_, indice) => (__mk(), new Date(mese.getFullYear(), mese.getMonth(), indice - scarto + 1)));
  function sposta(delta: number) {__mk(); setMese(new Date(mese.getFullYear(), mese.getMonth() + delta, 1)); }
  return <Card title="Calendario delle udienze">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <h3 className="font-semibold">{mese.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => (__mk(), sposta(-1))}>Mese precedente</Button>
        <Button variant="secondary" onClick={() => (__mk(), setMese(new Date(oggi.getFullYear(), oggi.getMonth(), 1)))}>Oggi</Button>
        <Button variant="secondary" onClick={() => (__mk(), sposta(1))}>Mese successivo</Button>
      </div>
    </div>
    <p className="text-sm text-(--mk-muted) mb-3">Data corrente: {oggi.toLocaleDateString("it-IT")}. In rosso le udienze da oggi al {limite.toLocaleDateString("it-IT")}, estremi inclusi. Le date trascorse sono escluse dall'urgenza.</p>
    <div className="flex flex-wrap gap-3 text-sm mb-3"><span className="text-(--mk-danger) font-semibold">Entro 5 giorni</span><span className="text-(--mk-text)">Successive</span><span className="text-(--mk-muted)">Trascorse</span></div>
    <div className="overflow-x-auto">
      <div style={{ minWidth: "42rem" }}>
        <div className="grid grid-cols-7 bg-(--mk-subtle)">{["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((nome) => (__mk(), <div key={nome} className="p-2 text-sm font-semibold">{nome}</div>))}</div>
        <div className="grid grid-cols-7 border-l border-t border-(--mk-border)">
          {giorni.map((giorno, indice) => {__mk();
            const tempo = giorno.getTime();
            const vicina = tempo >= oggi.getTime() && tempo <= limite.getTime();
            const trascorsa = tempo < oggi.getTime();
            const nelMese = giorno.getMonth() === mese.getMonth();
            const udienze = eventi.filter((evento) => (__mk(), evento.data && evento.data.getTime() === tempo));
            return <div key={indice} className={"min-h-28 p-2 border-r border-b border-(--mk-border) " + (nelMese ? "bg-(--mk-surface)" : "bg-(--mk-subtle)")}>
              <div className={"text-sm mb-2 " + (tempo === oggi.getTime() ? "font-bold underline text-(--mk-text)" : "text-(--mk-muted)")}>{giorno.getDate()}{tempo === oggi.getTime() && " · Oggi"}</div>
              {udienze.map((evento) => (__mk(), <div key={evento.indice} className={"rounded border border-(--mk-border) p-2 mb-2 break-words " + (vicina ? "text-(--mk-danger) font-semibold" : trascorsa ? "text-(--mk-muted)" : "text-(--mk-text)")} style={{ borderColor: vicina ? "var(--mk-danger)" : "var(--mk-border)" }}>
                <div>{evento.titolo}</div><div className="text-xs">{vicina ? "Entro 5 giorni" : trascorsa ? "Trascorsa" : "In programma"}</div>
                <Button variant="link" onClick={() => (__mk(), openDetail(pageId, evento.indice))}>Apri</Button>
              </div>))}
            </div>;
          })}
        </div>
      </div>
    </div>
    {nonValide > 0 && <p className="text-sm text-(--mk-muted) mt-2">Ricorsi senza data valida, esclusi dal calendario: {nonValide}.</p>}
    {eventi.length === 0 && <p className="mt-2">Nessun ricorso presente.</p>}
  </Card>;
}
