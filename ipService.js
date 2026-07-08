/**
 * 로컬 DB에서 IP 정보를 조회하여 AbuseIPDB check API 포맷으로 반환합니다.
 * @param {object} pool - mysql2 connection pool
 * @param {string} ipAddress - 조회할 IP 주소
 */
async function checkIpFromLocalDb(pool, ipAddress) {
  try {
    const sql = `SELECT ip_address, json_data FROM ip_abuse_json WHERE ip_address = ?`;
    const [rows] = await pool.execute(sql, [ipAddress]);

    if (rows.length === 0) {
      return {
        data: {
          ipAddress: ipAddress,
          message: '해당 IP는 블랙리스트 데이터베이스에 존재하지 않습니다.',
        },
      };
    }

    const row = rows[0];
    const json =
      typeof row.json_data === 'string'
        ? JSON.parse(row.json_data)
        : row.json_data;

    return {
      data: {
        ipAddress: row.ip_address,
        domain: json.domain || null,
        hostnames: json.hostnames || [],
        isWhitelisted: json.isWhitelisted === true,
        abuseConfidenceScore: json.abuseConfidenceScore || 0,
        totalReports: json.totalReports || 0,
        numDistinctUsers: json.numDistinctUsers || 0,
        countryName: json.countryName || null,
        countryCode: json.countryCode || null,
        usageType: json.usageType || null,
        isp: json.isp || null,
        lastReportedAt: json.lastReportedAt || null,
        requestTime: json.requestTime || null,
        reports: json.reports || [],
        isPublic: json.isPublic || false,
        isTor: json.isTor || false,
        ipVersion: json.ipVersion || 4,
      },
    };
  } catch (error) {
    console.error(
      '[DB Service Error] 로컬 DB 조회 중 오류 발생:',
      error.message,
    );
    throw new Error('데이터베이스 조회 중 오류가 발생했습니다.');
  }
}

module.exports = {
  checkIpFromLocalDb,
};
