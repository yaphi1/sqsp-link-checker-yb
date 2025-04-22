'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from "./page.module.css";
import { LinkStatus } from './types';

export default function Home() {
  const [linkStatuses, setLinkStatuses] = useState<Array<LinkStatus>>();
  const [lastChecked, setLastChecked] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const getLinkStatuses = useCallback(async ({ useCache } : { useCache: boolean; }) => {
    setIsLoading(true);
    const response: {
      lastUpdatedTimestampInMs: number;
      linkStatuses: Array<LinkStatus>
    } = await fetch(`/api/link-statuses${useCache ? '' : '?bustCache'}`).then(res => res.json());

    setLinkStatuses(response.linkStatuses);
    setLastChecked(response.lastUpdatedTimestampInMs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getLinkStatuses({ useCache: true });
  }, [getLinkStatuses]);

  return (
    <div className={styles.page}>
      <h1>Which showcased sites are currently on Squarespace?</h1>
      <div style={{
        maxWidth: '900px',
      }}>
        <div style={{
          padding: '20px 4px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div>
            <div>
              <b>Showcase location:</b> <a href="https://www.squarespace.com/showcase" target="_blank">https://www.squarespace.com/showcase</a>
            </div>
            {lastChecked && (
              <div style={{
                paddingTop: '8px',
              }}>
                <b>Last checked:</b> {new Date(lastChecked).toString()}
                
              </div>
            )}
          </div>
          <div>
            <button
              className={styles.buttonPrimary}
              onClick={() => {
                getLinkStatuses({ useCache: false });
              }}
            >
              Check Again
            </button>
          </div>
        </div>
        {!isLoading && linkStatuses?.map(linkStatus => (
          <div key={linkStatus.url} style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '40px',
            padding: '4px',
            backgroundColor: linkStatus.isSquarespaceSite ? 'transparent' : '#fdd',
            fontWeight: linkStatus.isSquarespaceSite ? 'normal' : 'bold',
          }}>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={styles.pageLink}
            >
              {linkStatus.url}
            </a>
            <div>{linkStatus.isSquarespaceSite ? 'Yes' : 'No'}</div>
          </div>
        )) || (
          <div style={{ padding: '4px' }}>Loading...</div>
        )}
      </div>
    </div>
  );
}
