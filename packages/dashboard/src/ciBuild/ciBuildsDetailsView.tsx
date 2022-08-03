import React, { FunctionComponent } from 'react';

export const CiBuildsDetailsView: CiBuildsDetailsViewComponent = (props) => {
  return (
    <>
      <p>CiBuilds Details View</p>
    </>
  );
};

type CiBuildsDetailsViewProps = {};

type CiBuildsDetailsViewComponent = FunctionComponent<CiBuildsDetailsViewProps>;
