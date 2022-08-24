import React, { FunctionComponent } from 'react';

export const CiBuildDetailsView: CiBuildsDetailsViewComponent = (props) => {
  return (
    <>
      <p>CiBuilds Details View</p>
    </>
  );
};

type CiBuildsDetailsViewProps = {};

type CiBuildsDetailsViewComponent = FunctionComponent<CiBuildsDetailsViewProps>;
