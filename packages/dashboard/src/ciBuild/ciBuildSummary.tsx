import { CardContent, Collapse, Grid, Typography } from '@mui/material';
import {
  getRunClaimedSpecsCount,
  getRunDurationSeconds,
  getRunOverallSpecsCount,
  getRunTestsProgress,
  getRunTestsProgressReducer,
} from '@sorry-cypress/common';
import { Card, CiUrl, getCiData } from '@sorry-cypress/dashboard/components/';
import {
  CiBuild,
  RunProgress,
} from '@sorry-cypress/dashboard/generated/graphql';
import { parseISO } from 'date-fns';
import { every, isEmpty } from 'lodash';
import React, { FunctionComponent } from 'react';
import { Commit } from '../run/commit';
import { RunDuration } from '../run/runDuration';
import { RunningStatus } from '../run/runningStatus';
import { RunSpecs } from '../run/runSpecs';
import { RunStartTime } from '../run/runStartTime';
import { RunSummaryTestResults } from '../run/runSummaryTestResults';
import { RunTimeoutChip } from '../run/runTimeoutChip';

export const CiBuildSummary: CiBuildSummaryComponent = (props) => {
  const { ciBuild, linkToCiBuild, brief = false, compact = false } = props;

  if (!ciBuild || isEmpty(ciBuild.runs)) {
    return null;
  }

  const run = ciBuild.runs[0];

  const runMeta = run.meta;
  const runCreatedAt = ciBuild.createdAt;
  const hasCompletion = every(ciBuild.runs, (run) => !!run.completion);
  const completed = every(ciBuild.runs, (run) => !!run.completion?.completed);
  const inactivityTimeoutMs = run.completion?.inactivityTimeoutMs;

  const overallSpecsCount = ciBuild.runs.reduce(
    (acc, run) => acc + getRunOverallSpecsCount(run.progress as RunProgress),
    0
  );
  const claimedSpecsCount = ciBuild.runs.reduce(
    (acc, run) => acc + getRunClaimedSpecsCount(run.progress as RunProgress),
    0
  );

  const durationSeconds = getRunDurationSeconds(
    parseISO(ciBuild.createdAt),
    ciBuild.updatedAt ? parseISO(ciBuild.updatedAt) : null,
    run.completion?.inactivityTimeoutMs ?? null
  );

  const testsProgress = ciBuild.runs.reduce(
    (acc, run) =>
      getRunTestsProgressReducer(
        acc,
        getRunTestsProgress(run.progress as RunProgress)
      ),
    {
      overall: 0,
      passes: 0,
      failures: 0,
      pending: 0,
      flaky: 0,
      skipped: 0,
    }
  );

  const ciData = getCiData({
    ciBuildId: runMeta?.ciBuildId,
    projectId: runMeta?.projectId,
  });

  return (
    <Card
      linkTo={
        linkToCiBuild
          ? `/ci-builds/${encodeURIComponent(ciBuild.ciBuildId)}`
          : undefined
      }
    >
      <CardContent sx={{ py: '8px !important' }}>
        <Grid
          container
          alignItems="flex-start"
          flexDirection={{ xs: 'column', md: 'row' }}
        >
          <Grid item container xs zeroMinWidth spacing={1}>
            <Grid item container>
              <Grid item>
                {hasCompletion && !completed && <RunningStatus />}
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography
                  component="h1"
                  variant="h6"
                  noWrap
                  color="text.secondary"
                >
                  {runMeta.ciBuildId}
                </Typography>
              </Grid>
            </Grid>
            {!compact && (
              <Grid item container spacing={1} mb={1}>
                <Grid item>
                  <RunStartTime runCreatedAt={runCreatedAt} />
                </Grid>
                <Grid item>
                  <RunDuration
                    completed={run.completion?.completed}
                    createdAtISO={runCreatedAt}
                    wallClockDurationSeconds={durationSeconds}
                  />
                </Grid>
                <Grid item>
                  <RunSpecs
                    claimedSpecsCount={claimedSpecsCount}
                    overallSpecsCount={overallSpecsCount}
                  />
                </Grid>
                <Grid item>
                  {hasCompletion && completed && inactivityTimeoutMs && (
                    <RunTimeoutChip inactivityTimeoutMs={inactivityTimeoutMs} />
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item my={1}>
            {run.progress && (
              <RunSummaryTestResults testsStats={testsProgress} />
            )}
          </Grid>
        </Grid>
        <Collapse in={!compact}>
          <Grid container>
            {ciData && (
              <Grid item sm={12} md={6} lg={6} xl={4}>
                <CiUrl {...ciData} disableLink={linkToCiBuild} />
              </Grid>
            )}
            <Commit
              brief={brief}
              noLinks={linkToCiBuild}
              commit={runMeta?.commit}
            />
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

type CiBuildSummaryProps = {
  brief?: boolean;
  compact?: boolean;
  ciBuild: CiBuild;
  linkToCiBuild?: boolean;
};
type CiBuildSummaryComponent = FunctionComponent<CiBuildSummaryProps>;
