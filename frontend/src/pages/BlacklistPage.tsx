import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v2';

interface BlacklistItem {
  ip: string;
  abuseConfidenceScore?: number;
  isp?: string;
  countryName?: string;
  usageType?: string;
  totalReports?: number;
  checkedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function BlacklistPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateParam = searchParams.get('date') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [items, setItems] = useState<BlacklistItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateValue, setDateValue] = useState(dateParam);
  const [ipSearchValue, setIpSearchValue] = useState('');
  const [ipSearchResult, setIpSearchResult] = useState<{ found: boolean; dates: string[] } | null>(null);
  const [ipSearchLoading, setIpSearchLoading] = useState(false);

  useEffect(() => {
    if (!dateParam) return;
    setLoading(true);
    setError('');
    axios
      .get(`${API_BASE_URL}/ip/blacklist`, {
        params: { date: dateParam, page: pageParam },
      })
      .then((res) => {
        setItems(res.data.data || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dateParam, pageParam]);

  const goToPage = (page: number) => {
    setSearchParams({ date: dateParam, page: String(page) });
  };

  const handleDateSearch = () => {
    if (!dateValue) return;
    navigate(`/blacklist?date=${dateValue}&page=1`);
  };

  const handleIpSearch = async () => {
    const ip = ipSearchValue.trim();
    if (!ip) return;
    setIpSearchLoading(true);
    setIpSearchResult(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/ip/blacklist/search`, { params: { ip } });
      setIpSearchResult(res.data);
    } catch {
      setIpSearchResult({ found: false, dates: [] });
    } finally {
      setIpSearchLoading(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (score == null) return 'text-gray-400';
    if (score >= 75) return 'text-red-400';
    if (score >= 25) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-1 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="bg-gray-800/60 border border-gray-700/60 rounded-md px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500/50 [color-scheme:dark]"
            />
            <button
              onClick={handleDateSearch}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-semibold transition-colors"
            >
              <Search className="w-4 h-4" /> 날짜 조회
            </button>
          </div>
          <span className="text-gray-600 text-sm">|</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ipSearchValue}
              onChange={(e) => setIpSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleIpSearch()}
              placeholder="IP 주소 입력"
              className="bg-gray-800/60 border border-gray-700/60 rounded-md px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500/50 w-52"
            />
            <button
              onClick={handleIpSearch}
              disabled={ipSearchLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" /> IP 조회
            </button>
          </div>
        </div>

        {ipSearchResult && (
          <div className={`p-4 rounded-xl border text-sm ${ipSearchResult.found ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'}`}>
            {ipSearchResult.found
              ? `IP가 블랙리스트에서 발견되었습니다 (${ipSearchResult.dates.join(', ')})`
              : '해당 IP는 블랙리스트에 존재하지 않습니다.'}
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">
            불러오는 중...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && dateParam && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800/40 rounded-xl bg-[#111827]/40">
            <Calendar className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">
              해당 날짜에 블랙리스트가 없습니다.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={`${item.ip}-${item.checkedAt}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#111827]/60 border border-red-900/30 hover:border-red-700/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <span className="text-sm font-mono font-semibold text-white">
                        {item.ip}
                      </span>
                      <span className="text-[11px] text-gray-500 ml-2">
                        {new Date(item.checkedAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-400">
                      {item.countryName || '-'}
                    </span>
                    <span
                      className={`font-bold ${getScoreColor(item.abuseConfidenceScore)}`}
                    >
                      {item.abuseConfidenceScore != null
                        ? `${item.abuseConfidenceScore}%`
                        : '-'}
                    </span>
                    <span className="text-gray-500">
                      {item.totalReports != null
                        ? `신고 ${item.totalReports}회`
                        : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-gray-800/60 border border-gray-700/60 text-gray-300 hover:bg-gray-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> 이전
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      Math.abs(p - pagination.page) <= 2 ||
                      p === 1 ||
                      p === pagination.totalPages,
                  )
                  .reduce((acc: (number | string)[], p, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    typeof p === 'string' ? (
                      <span
                        key={'e' + i}
                        className="text-xs text-gray-600 px-1"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                          p === pagination.page
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-gray-800/60 border border-gray-700/60 text-gray-300 hover:bg-gray-700/60'
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-gray-800/60 border border-gray-700/60 text-gray-300 hover:bg-gray-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  다음 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {!dateParam && !loading && (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800/40 rounded-xl bg-[#111827]/40">
            <Calendar className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">
              조회할 날짜를 선택하고 검색 버튼을 눌러주세요.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
