import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import type { GraphData } from '../types';

const nodeColor: Record<string, string> = {
  wallet: '#1B2A45',
  transaction: '#B5651D',
  ip: '#A3311A',
  cluster: '#8A6A17',
};

export default function GraphView({ data, focusId }: { data: GraphData; focusId?: string }) {
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
          data: { id: `e${i}`, source: e.source, target: e.target, relation: e.relation },
        })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: any) => nodeColor[ele.data('type')] ?? '#94A3B8',
            label: 'data(label)',
            color: '#1E2430',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            width: 34,
            height: 34,
            'border-width': (ele: any) => (ele.data('id') === focusId ? 3 : 0),
            'border-color': '#A3311A',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#CBD5E1',
            'target-arrow-color': '#CBD5E1',
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
