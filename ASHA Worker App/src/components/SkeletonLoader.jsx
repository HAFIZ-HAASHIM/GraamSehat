import React from 'react';

export function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeletons = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      if (type === 'card') {
        items.push(
          <div key={i} className="glass-panel border-2 border-gray-200 p-6 rounded-3xl flex flex-col gap-4 w-full bg-white animate-pulse">
            <div className="h-5 w-2/5 rounded-full shimmer-bg bg-gray-200" />
            <div className="h-6 w-3/4 rounded-full shimmer-bg bg-gray-200" />
            <div className="h-4 w-1/2 rounded-full shimmer-bg bg-gray-200" />
          </div>
        );
      } else if (type === 'list-item') {
        items.push(
          <div key={i} className="p-5 bg-white border-2 border-gray-200 rounded-3xl flex items-center justify-between gap-4 w-full animate-pulse">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-2xl shimmer-bg bg-gray-200 shrink-0" />
              <div className="flex flex-col gap-2.5 w-full">
                <div className="h-5 w-2/5 rounded-full shimmer-bg bg-gray-200" />
                <div className="h-4 w-1/3 rounded-full shimmer-bg bg-gray-200" />
              </div>
            </div>
          </div>
        );
      } else if (type === 'chart') {
        items.push(
          <div key={i} className="glass-panel border-2 border-gray-200 p-6 rounded-3xl flex flex-col gap-4 w-full h-80 bg-white animate-pulse">
            <div className="h-5 w-1/4 rounded-full shimmer-bg bg-gray-200" />
            <div className="flex-1 flex items-end gap-2.5 pt-4">
              <div className="flex-1 h-1/5 rounded-full shimmer-bg bg-gray-200" />
              <div className="flex-1 h-1/2 rounded-full shimmer-bg bg-gray-200" />
              <div className="flex-1 h-3/4 rounded-full shimmer-bg bg-gray-200" />
              <div className="flex-1 h-2/5 rounded-full shimmer-bg bg-gray-200" />
              <div className="flex-1 h-4/5 rounded-full shimmer-bg bg-gray-200" />
            </div>
          </div>
        );
      }
    }
    return items;
  };

  return (
    <div className={`w-full ${type === 'card' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'flex flex-col gap-3'}`}>
      {renderSkeletons()}
    </div>
  );
}

export default SkeletonLoader;
