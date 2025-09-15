import React from 'react';
import { Tree } from 'antd';

export interface UnitNode {
  key: string;
  title: string;
  children?: UnitNode[];
}

// Fake data demo
export const demoData: UnitNode[] = [
  {
    key: '99999',
    title: '99999 全事業',
    children: [
      {
        key: '91000',
        title: '91000 経営管理本部',
        children: [
          {
            key: '91200',
            title: '91200 経営管理本部',
            children: [
              { key: '101', title: '101 経営陣' },
              { key: '103', title: '103 総務担当103' },
              { key: '104', title: '104 人事部門担当104' },
              { key: '105', title: '105 経営計画/段階費105' },
              { key: '112', title: '112 経営管理費112' },
              { key: '111', title: '111 福利担当111' },
              { key: '829', title: '829 経営管理本部費用829' },
            ],
          },
        ],
      },
      {
        key: '93000',
        title: '93000 事業統括本部',
        children: [
          {
            key: '93100',
            title: '93100 Tokyo支店',
            children: [
              {
                key: '93110',
                title: '93110 Tokyo文支店',
                children: [
                  { key: '806', title: '806 Tokyo文支費用806' },
                ],
              },
              {
                key: '93121',
                title: '93121 Tokyo営業所',
                children: [
                  { key: '813', title: '813 Tokyo営業用813' },
                  {
                    key: '83121',
                    title: '83121 Tokyo新橋(新橋更新 計)',
                    children: [
                      { key: '251', title: '251 新橋経費251' },
                      { key: '259', title: '259 新橋経費259' },
                    ],
                  },
                  { key: '83122', title: '83122 Tokyo多摩(危機更新 計)' },
                  { key: '83123', title: '83123 Tokyo品川(川崎更新 計)' },
                ],
              },
              { key: '93123', title: '93123 大手町営業所' },
            ],
          },
          { key: '93000-2', title: '93000 事業統括本部' },
        ],
      },
      { key: '97000', title: '97000 その他(調査部門)' },
    ],
  },
];

// Helper to get all keys recursively
const getAllKeys = (nodes: UnitNode[]): string[] => {
  let keys: string[] = [];
  for (const node of nodes) {
    keys.push(node.key);
    if (node.children) {
      keys = keys.concat(getAllKeys(node.children));
    }
  }
  return keys;
};

// Helper: convert tree data, nếu là leaf thì title màu đỏ
const decorateLeafRed = (nodes: UnitNode[]): any[] => {
  return nodes.map(node => {
    const isLeaf = !node.children || node.children.length === 0;
    return {
      ...node,
      title: isLeaf ? <span style={{ color: '#ff4d4f' }}>{node.title}</span> : node.title,
      children: node.children ? decorateLeafRed(node.children) : undefined,
    };
  });
};

// Helper: lấy tất cả title của node cha và các node con dựa trên title
export const getAllTitlesByTitle = (nodes: UnitNode[], title: string): string[] => {
  for (const node of nodes) {
    let nodeTitle = node.title;
    if (typeof nodeTitle === 'object' && nodeTitle && 'props' in (nodeTitle as any)) nodeTitle = (nodeTitle as any).props.children;
    if (nodeTitle === title) {
      // Tìm thấy node, lấy tất cả title của node này và con
      return collectTitles(node);
    }
    if (node.children) {
      const found = getAllTitlesByTitle(node.children, title);
      if (found.length) return found;
    }
  }
  return [];
};

function collectTitles(node: UnitNode): string[] {
  let titles: string[] = [];
  let t = node.title;
  if (typeof t === 'object' && t && 'props' in (t as any)) t = (t as any).props.children;
  if (t) titles.push(t as string);
  if (node.children) {
    for (const child of node.children) {
      titles = titles.concat(collectTitles(child));
    }
  }
  return titles;
}

interface UnitTreeProps {
  onSelect?: (key: string) => void;
  selectedKey?: string;
  showAllButton?: boolean;
}

const UnitTree: React.FC<UnitTreeProps> = ({ onSelect, selectedKey, showAllButton }) => {
  const allKeys = getAllKeys(demoData);
  const treeData = decorateLeafRed(demoData);
  return (
    <div>
      {showAllButton && (
        <button
          style={{
            width: '100%',
            textAlign: 'left',
            color: '#1890ff',
            fontWeight: 500,
            fontSize: 14,
            padding: '4px 16px',
            border: 'none',
            background: '#e6f7ff',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 2,
            cursor: 'pointer',
            borderRadius: 0,
            outline: 'none',
            transition: 'background 0.2s',
          }}
          onClick={() => onSelect && onSelect('all')}
        >
          Tất cả đơn vị
        </button>
      )}
      <Tree
        treeData={treeData}
        expandedKeys={allKeys}
        showLine
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelect={(_, info) => {
          if (onSelect && info.selected && info.node) {
            onSelect((info.node.title && typeof info.node.title === 'string') ? info.node.title : (info.node.title?.props?.children || ''));
          }
        }}
        style={{ background: '#fff', padding: 16, borderRadius: 8 }}
      />
    </div>
  );
};

export default UnitTree;
