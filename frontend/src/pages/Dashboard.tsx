import type { IPMetadata } from '../types/threat';
import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { IPSearchForm } from '../components/organisms/IPSearchForm';
import { ScanResultView } from '../components/organisms/ScanResultView';
import { Footer } from '../components/layout/Footer';

const OFFLINE_DB: Record<string, IPMetadata> = {
  '189.20.181.138': {
    ip: '189.20.181.138',
    threatScore: 100,
    isp: 'TELEFONICA BRASIL S.A',
    usageType: 'Mobile ISP',
    hostname: '189-20-181-138.customer.tdatabrasil.net.br',
    domainName: 'telefonica.com.br',
    country: 'Brazil',
    totalReports: 1420,
    uniqueSources: 24,
    latestReportDate: '2026-07-03',
    status: 'Danger',
  },
  '8.8.8.8': {
    ip: '8.8.8.8',
    threatScore: 0,
    isp: 'Google LLC',
    usageType: 'DNS Server',
    hostname: 'dns.google',
    domainName: 'google.com',
    country: 'United States',
    totalReports: 0,
    uniqueSources: 0,
    latestReportDate: 'N/A',
    status: 'Safe',
  },
};

export function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<IPMetadata | null>(null);

  const handleIPSearch = async (ipToSearch: string) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let resultData = OFFLINE_DB[ipToSearch];

      if (!resultData) {
        const simulatedScore = Math.floor(Math.random() * 101);
        resultData = {
          ip: ipToSearch,
          threatScore: simulatedScore,
          isp: 'Cloudflare, Inc. Global Network',
          usageType: 'CDN / Anycast Hub Proxy',
          hostname: `${ipToSearch.replace(/\./g, '-')}.cloudflare-anycast.net`,
          domainName: 'cloudflare.com',
          country: 'South Korea',
          totalReports:
            simulatedScore > 30 ? Math.floor(Math.random() * 180) + 12 : 0,
          uniqueSources:
            simulatedScore > 30 ? Math.floor(Math.random() * 10) + 1 : 0,
          latestReportDate: new Date().toISOString().split('T')[0],
          status:
            simulatedScore >= 71
              ? 'Danger'
              : simulatedScore >= 31
                ? 'Warning'
                : 'Safe',
        };
      }

      setCurrentResult(resultData);
    } catch (error) {
      console.error('[IP Search Error]:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      <Header analystName="Young-Hun" role="Security Analyst" />

      <main className="flex-1 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        <div className="pb-2 border-b border-gray-800/60">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex flex-wrap items-center gap-x-2 gap-y-1 leading-none">
            <span className="text-gray-300 font-extrabold">실시간 IP 검사</span>
            <span className="text-blue-500 font-light select-none">»</span>
            <span className="text-[#F97316] font-mono drop-shadow-[0_4px_10px_rgba(249,115,22,0.25)] tracking-tight">
              {currentResult ? currentResult.ip : ''}
            </span>
          </h1>
        </div>

        <IPSearchForm onSearch={handleIPSearch} isLoading={isLoading} />

        {currentResult ? (
          <ScanResultView result={currentResult} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800/40 rounded-xl bg-[#111827]/40">
            <div className="w-16 h-16 rounded-full bg-gray-800/40 flex items-center justify-center text-gray-500 mb-4 border border-gray-800/80"></div>
            <h3 className="text-base font-bold text-gray-200">
              데이터가 없습니다
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm text-center leading-relaxed">
              조사하려는 의심스러운 IP 주소를 상단 검색창에 입력하고 검색 버튼을
              클릭하시면 실시간 위협 보고서 정보가 이곳에 활성화됩니다.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
