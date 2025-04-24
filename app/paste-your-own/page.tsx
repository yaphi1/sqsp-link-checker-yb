'use client';

import { FormEvent, useState } from 'react';
import styles from "../page.module.css";
import { LinkStatus } from '../types';
import { Loader } from '../Loader';

export default function PasteYourOwn() {
  const [linkStatuses, setLinkStatuses] = useState<Array<LinkStatus>>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const rawText = formJson.linkTextArea as string;
    
    setIsLoading(true);

    const response: {
      linkStatuses: Array<LinkStatus>
    } = await fetch('/api/link-statuses', {
      method: 'POST',
      body: rawText,
    }).then(res => res.json());

    setLinkStatuses(response.linkStatuses);
    setIsLoading(false);
  }

  return (
    <div className={styles.page}>
      <h1
        style={{
          marginBottom: '20px',
        }}
      >
        Check if sites are on Squarespace
      </h1>
      <div style={{
        maxWidth: '900px',
      }}>
        <form method="post" onSubmit={handleSubmit}
          style={{
            marginBottom: '20px',
          }}
        >
          <label style={{
            maxWidth: '900px',
          }}>
            <b>Enter URLs below:</b>
            <div style={{
              color: '#555',
              fontSize: '16px',
            }}>
              URLs can be separated by commas, spaces, or newlines.
            </div>
            <textarea
              name="linkTextArea"
              className={styles.urlTextArea}
            >
            </textarea>
          </label>
          <div>
            <button type="submit" className={styles.buttonPrimary}>
              Check Sites
            </button>
          </div>
        </form>
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
              href={linkStatus.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {linkStatus.url}
            </a>
            <div>{linkStatus.isSquarespaceSite ? 'Yes' : 'No'}</div>
          </div>
        ))}
        {isLoading && (
          <Loader
            phrases={[
              'Validating pasted links...',
              'Checking sites...',
            ]}
          />
        )}
      </div>
    </div>
  );
}
