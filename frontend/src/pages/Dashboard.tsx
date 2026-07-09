import type { IPMetadata } from '../types/threat';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { IPSearchForm } from '../components/organisms/IPSearchForm';
import { ScanResultView } from '../components/organisms/ScanResultView';
import { Footer } from '../components/layout/Footer';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v2';

function mapApiResult(data: any, ip: string): IPMetadata {
  const score = data.abuseConfidenceScore ?? 0;
  return {
    ip: data.ipAddress || ip,
    threatScore: score,
    isp: data.isp || '-',
    usageType: data.usageType || '-',
    hostname: data.hostnames?.[0] || ip,
    domainName: data.domain || '-',
    country: data.countryName || '-',
    totalReports: data.totalReports ?? 0,
    uniqueSources: data.numDistinctUsers ?? 0,
    latestReportDate: data.lastReportedAt || 'N/A',
    status: score >= 75 ? 'Danger' : score >= 25 ? 'Warning' : 'Safe',
    isExternalFetch: data.isExternalFetch ?? false,
  };
}

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<IPMetadata | null>(null);
  const [rawData, setRawData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string>('');

  useEffect(() => {
    const ipFromUrl = searchParams.get('ip');
    if (ipFromUrl) {
      handleIPSearch(ipFromUrl);
    }
  }, []);

  const handleIPSearch = async (ipToSearch: string) => {
    setIsLoading(true);
    setSearchError('');
    setCurrentResult(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/ip/check`, {
        params: { ip: ipToSearch },
      });

      setCurrentResult(mapApiResult(res.data.data, ipToSearch));
      setRawData(res.data.data);
      setSearchParams({ ip: ipToSearch }, { replace: true });
    } catch (error) {
      setSearchParams({}, { replace: true });
      setSearchError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      <Header />

      <main className="flex-1 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        <IPSearchForm
          onSearch={handleIPSearch}
          isLoading={isLoading}
          initialIp={searchParams.get('ip') || ''}
        />

        {searchError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
            {searchError}
          </div>
        )}

        {currentResult ? (
          <ScanResultView result={currentResult} rawData={rawData} />
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
