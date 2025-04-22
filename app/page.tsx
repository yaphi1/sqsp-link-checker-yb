'use client';

import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { LinkStatus } from './types';

export default function Home() {
  const [linkStatuses, setLinkStatuses] = useState<Array<LinkStatus>>();
  const [lastChecked, setLastChecked] = useState<number>();
  useEffect(() => {
    (async () => {
      const response: {
        linkStatuses: Array<LinkStatus>
      } = await fetch('/api/link-statuses').then(res => res.json());

      setLinkStatuses(response.linkStatuses);
      setLastChecked(Date.now());
    })();
  }, []);

  return (
    <div className={styles.page}>
      <h1>Which showcased sites are currently on Squarespace?</h1>
      <div style={{
        padding: '20px 4px',
      }}>
        <div>
          Showcase location: <a href="https://www.squarespace.com/showcase" target="_blank">https://www.squarespace.com/showcase</a>
        </div>
        {lastChecked && (
          <div style={{
            paddingTop: '8px',
          }}>
            Last checked: {new Date(lastChecked).toString()}
          </div>
        )}
      </div>
      {linkStatuses?.map(linkStatus => (
        <div key={linkStatus.url} style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '800px',
          gap: '40px',
          padding: '4px',
          backgroundColor: linkStatus.isSquarespaceSite ? 'transparent' : '#fdd',
          fontWeight: linkStatus.isSquarespaceSite ? 'normal' : 'bold',
        }}>
          <div>{linkStatus.url}</div>
          <div>{linkStatus.isSquarespaceSite ? 'Yes' : 'No'}</div>
        </div>
      )) || (
        <div style={{ padding: '4px' }}>Loading...</div>
      )}
    </div>
  );
}
