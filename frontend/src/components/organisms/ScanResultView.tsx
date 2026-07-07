import type { IPMetadata } from '../../types/threat';
import { ThreatScoreGauge } from '../molecules/ThreatScoreGauge';
import { MetadataTable } from '../molecules/MetadataTable';
import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ScanResultViewProps {
  result: IPMetadata;
}

export const ScanResultView: React.FC<ScanResultViewProps> = React.memo(
  ({ result }) => {
    return (
      <div className="flex flex-col gap-8 animate-fadeIn">
        {/* 위협 등급 요약 알림 배너 */}
        <div
          className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 shadow-lg ${
            result.threatScore >= 71
              ? 'bg-red-500/10 border-red-500/30 text-red-100'
              : result.threatScore >= 31
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
          }`}
        >
          <div className="flex items-start md:items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                result.threatScore >= 71
                  ? 'bg-red-500/20 text-red-400'
                  : result.threatScore >= 31
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {result.threatScore >= 71 ? (
                <ShieldAlert className="w-6 h-6" />
              ) : result.threatScore >= 31 ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg tracking-tight">
                IP {result.ip}{' '}
                {result.threatScore >= 71
                  ? '블랙리스트 위협 DB에 기록된 위험한 IP입니다'
                  : result.threatScore >= 31
                    ? '블랙리스트 위협 DB에 기록된 주의 대상 IP입니다'
                    : '데이터베이스에서 찾을 수 없습니다.'}
              </h3>
              <p className="text-xs mt-1 text-gray-400 leading-relaxed font-medium">
                {result.threatScore >= 71
                  ? `해당 IP주소는 총 ${result.uniqueSources}개의 독립된 곳에서 누적 ${result.totalReports}회 신고되었습니다.`
                  : result.threatScore >= 31
                    ? `해당 IP주소는 총 ${result.uniqueSources}개의 독립된 곳에서 누적 ${result.totalReports}회 신고되었습니다.`
                    : '보안 유출 이력이 확인되지 않은 안전한 클린 IP 대역입니다.'}
              </p>
            </div>
          </div>
          <div className="self-stretch md:self-auto flex items-center justify-end">
            <span
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                result.threatScore >= 71
                  ? 'bg-red-500/20 text-red-300'
                  : result.threatScore >= 31
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {result.threatScore >= 71
                ? '위험군 IP'
                : result.threatScore >= 31
                  ? '주의대상 IP'
                  : '정상 신뢰 IP'}
            </span>
          </div>
        </div>

        {/* 실시간 위협 수치 및 메타데이터 세부 구성 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch animate-fadeIn">
          <div className="lg:col-span-1">
            <ThreatScoreGauge score={result.threatScore} />
          </div>
          <div className="lg:col-span-2 flex">
            <MetadataTable metadata={result} />
          </div>
        </div>
      </div>
    );
  },
);
