import type { IPMetadata } from '../../types/threat';
import { Activity, Globe, User, ExternalLink, Clock } from 'lucide-react';

interface MetadataTableProps {
  metadata: IPMetadata;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({ metadata }) => {
  const rows = [
    {
      label: 'IP 주소',
      value: metadata.ip,
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: 'ISP 제공업체',
      value: metadata.isp,
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: '사용 유형',
      value: metadata.usageType,
      icon: <User className="w-4 h-4" />,
    },
    {
      label: '호스트명 (Hostname)',
      value: metadata.hostname,
      icon: <ExternalLink className="w-4 h-4" />,
    },
    {
      label: '도메인 이름 (Domain)',
      value: metadata.domainName,
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: '국가 (Country)',
      value: metadata.country,
      icon: <Globe className="w-4 h-4" />,
    },
  ];
  return (
    <div className="bg-[#161D30] rounded-xl border border-gray-800/80 p-6 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          세부 메타데이터 상세 분석
        </h3>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> 최근 보고일:{' '}
          {metadata.latestReportDate}
        </span>
      </div>
      <div className="divide-y divide-gray-800/60">
        {rows.map((row, index) => (
          <div
            key={index}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium text-gray-400">
              {row.icon}
              <span>{row.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200 text-right break-all">
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
