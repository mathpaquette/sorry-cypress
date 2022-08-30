import { NavItemType, setNav } from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

export const CiBuildDetailsView: CiBuildsDetailsViewComponent = (props) => {
  const { ciBuildId } = useParams();

  useLayoutEffect(() => {
    setNav([
      {
        type: NavItemType.ciBuilds,
        label: 'CI Builds',
        link: './ci-builds',
      },
      {
        type: NavItemType.latestRuns,
        label: `${ciBuildId}`,
      },
    ]);
  }, []);

  return (
    <>
      <p>CiBuilds Details View</p>
    </>
  );
};

type CiBuildsDetailsViewProps = {};

type CiBuildsDetailsViewComponent = FunctionComponent<CiBuildsDetailsViewProps>;
