import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import type { GraphResponse } from '../types';

const nodeColor: Record<string, string> = {
  wallet: '#0E7490',
  transaction: '#1C2C47',
  ip: '#B4390A',
  cluster: '#B7791F',
};

export default function GraphView({ data, focusId }: { data: GraphResponse; focusId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...data.nodes.map((n) => ({
          data: { id: n.id, label: n.label, type: n.type },
        })),
        ...data.edges.map((e, i) => ({
          data: { id: e.id || `e${i}`, source: e.source, target: e.target, relation: e.type },
        })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: any) => nodeColor[ele.data('type')] ?? '#64748B',
            label: 'data(label)',
            color: '#E2E8F0',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            width: 34,
            height: 34,
            'border-width': (ele: any) => (ele.data('id') === focusId ? 3 : 0),
            'border-color': '#EF4444',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(relation)',
            'font-size': '8px',
            color: '#94A3B8',
          },
        },
      ],
      layout: { name: 'cose', animate: false, padding: 40 },
    });

    return () => cy.destroy();
  }, [data, focusId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
