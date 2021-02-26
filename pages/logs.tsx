import { Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import LogTable from '../components/log-table';
import { fetchData, LOGS_ALL } from '../utils/apis';

const FETCH_INTERVAL = 5 * 1000; // 5 sec

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [showConnectionError, setShowConnctionError] = useState<boolean>(false);

  const getInfo = async () => {
    try {
      const result = await fetchData(LOGS_ALL);

      if (result.length !== 0) {
        setLogs(result);
      }

      setShowConnctionError(false);
    } catch (error) {
      setShowConnctionError(true);
      console.log('==== error', error);
    }
  };

  useEffect(() => {
    let getStatusIntervalId = null;

    setInterval(getInfo, FETCH_INTERVAL);
    getInfo();

    getStatusIntervalId = setInterval(getInfo, FETCH_INTERVAL);
    // returned function will be called on component unmount
    return () => {
      clearInterval(getStatusIntervalId);
    };
  }, []);

  return (
    <>
      {showConnectionError && (
        <Alert
          message="Unable to load logs from the Owncast server."
          type="warning"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}
      <LogTable logs={logs} pageSize={20} />
    </>
  );
}
