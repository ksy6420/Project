import { useState } from 'react';
import React from 'react';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import { Search, RefreshCw } from 'lucide-react';

interface IPSearchFormProps {
  onSearch: (ip: string) => void;
  isLoading: boolean;
}

export const IPSearchForm: React.FC<IPSearchFormProps> = React.memo(
  ({ onSearch, isLoading }) => {
    const [ipInput, setIpInput] = useState<string>('189.20.181.138');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const ipPattern =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      if (!ipInput.trim()) {
        setError('검색할 IP 주소를 입력해 주세요.');
        return;
      }
      if (!ipPattern.test(ipInput.trim())) {
        setError('올바른 IPv4 형식으로 입력해 주세요. (예: 1.1.1.1)');
        return;
      }

      setError('');
      onSearch(ipInput.trim());
    };

    return (
      <section className="bg-gradient-to-r from-[#111827] via-[#161D30] to-[#111827] rounded-xl border border-gray-800/90 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <h2 className="text-lg md:text-xl font-bold text-gray-100 tracking-tight mb-2">
            의심되는 IP주소를 입력해주세요
          </h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            글로벌 위협 분석 네트워크로부터 최신 데이터 레퓨테이션 정보를 실시간
            피드백 받아 정밀 조사를 진행합니다.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 items-stretch"
          >
            <div className="flex-1">
              <InputField
                label="위협 추적 IP 주소"
                icon={Search}
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="예) 189.20.181.138"
                required
                error={error}
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                variant="orange"
                disabled={isLoading}
                className="w-full sm:w-auto h-[46px] px-8 hover:!bg-[#EA580C] !text-white !font-bold !rounded-lg !border-none transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>검색 실행</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    );
  },
);
