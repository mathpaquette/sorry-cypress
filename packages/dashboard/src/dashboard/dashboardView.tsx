import { setNav } from '@sorry-cypress/dashboard/lib/navigation';
import React, { useLayoutEffect } from 'react';

export function DashboardView() {
  useLayoutEffect(() => {
    setNav([]);
  }, []);

  return (
    <>
      <ul>
        <li>
          <a href={'./ci-builds'}>CI Builds</a>
        </li>
        <li>
          <a href={'./projects'}>Projects</a>
        </li>
      </ul>
    </>
  );
}
