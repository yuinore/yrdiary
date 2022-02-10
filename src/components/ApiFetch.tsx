import React, { useState, useEffect } from 'react';

const ApiFetch = (props: { callback: (data: string) => void }) => {
  const url =
    'https://yuinore.moe/30thou_2021.csv?rand=' + new Date().getTime();

  useEffect(() => {
    fetch(url, { method: 'GET' })
      .then((data) => data.text())
      .then((data) => {
        props.callback(data);
      });
  }, []);

  return <div />;
};

export default ApiFetch;
