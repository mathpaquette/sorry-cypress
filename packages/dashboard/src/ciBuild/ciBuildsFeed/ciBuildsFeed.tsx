import { Alert, Button, Paper, Skeleton } from '@mui/material';
import { range } from 'lodash';
import React, { FunctionComponent } from 'react';
import {useGetCiBuildsQuery} from "../../generated/graphql";

export const CiBuildsFeed: CiBuildsFeedComponent = (props) => {
  const {
    search = '',
    compact = false,
  } = props;

  const { data, loading, error } = useGetCiBuildsQuery({
  });

  if (loading) {
    return (
      <>
        {range(0, 3).map((key) => (
          <Skeleton
            variant="rectangular"
            height={compact ? 100 : 180}
            key={key}
            animation="wave"
            sx={{ my: 2 }}
          />
        ))}
      </>
    );
  }

  if (!data || error) {
    return (
      <Paper>
        <Alert severity="error" variant="filled">
          Error loading data
        </Alert>
      </Paper>
    );
  }

  if (data.ciBuilds.length === 0) {
    if (search) {
      return (
        <Paper>
          <Alert severity="warning" variant="filled">
            No runs found
          </Alert>
        </Paper>
      );
    }

    return (
      <Paper>
        <Alert severity="info" variant="filled">
          No runs started yet
        </Alert>
      </Paper>
    );
  }

  return (
    <>
      {data.ciBuilds.map((ciBuild) => (

          <p key={ciBuild?.ciBuildId}> {ciBuild?.ciBuildId}</p>

        // <RunSummary
        //   brief
        //   linkToRun
        //   key={ciBuild.}
        //   run={run}
        //   showActions={showActions}
        //   compact={compact}
        // />
      ))}
    </>
  );
};

type CiBuildsFeedProps = {
  compact?: boolean;
  search?: string;
};
type CiBuildsFeedComponent = FunctionComponent<CiBuildsFeedProps>;
