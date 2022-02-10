import React, { useState, useEffect } from 'react';

function ApiFetch(props: { callback: (data: string) => void }) {
  const { callback } = props;
  const url = `https://yuinore.moe/30thou_2021.csv?rand=${new Date().getTime()}`;

  useEffect(() => {
    fetch(url, { method: 'GET' })
      .then((data) => data.text())
      .then((data) => {
        callback(data);
      });
  }, []);

  return <div />;
}

export default ApiFetch;
