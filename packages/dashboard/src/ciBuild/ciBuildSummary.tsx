import { CardContent, Collapse, Grid, Typography } from '@mui/material';
import { Run } from '@sorry-cypress/api/generated/graphql';
import {
  getRunClaimedSpecsCount,
  getRunDurationSeconds,
  getRunOverallSpecsCount,
  getRunTestsProgress,
} from '@sorry-cypress/common';
import { Card, CiUrl, getCiData } from '@sorry-cypress/dashboard/components/';
import { parseISO } from 'date-fns';
import React, { FunctionComponent } from 'react';
import { Commit } from '../run/commit';
import { RunDuration } from '../run/runDuration';
import { RunningStatus } from '../run/runningStatus';
import { RunSpecs } from '../run/runSpecs';
import { RunStartTime } from '../run/runStartTime';
import { RunSummaryTestResults } from '../run/runSummaryTestResults';
import { RunTimeoutChip } from '../run/runTimeoutChip';

export const CiBuildSummary: CiBuildSummaryComponent = (props) => {
  const { runs, linkToRun, brief = false, compact = false } = props;

  if (!runs) {
    return null;
  }

  const run = runs[0];
  const runId = run.runId;
  const runMeta = run.meta;
  const runCreatedAt = run.createdAt;
  const hasCompletion = !!run.completion;
  const completed = !!run.completion?.completed;
  const inactivityTimeoutMs = run.completion?.inactivityTimeoutMs;

  const overallSpecsCount = getRunOverallSpecsCount(run.progress);
  const claimedSpecsCount = getRunClaimedSpecsCount(run.progress);
  const durationSeconds = getRunDurationSeconds(
    parseISO(run.createdAt),
    run.progress?.updatedAt ? parseISO(run.progress?.updatedAt) : null,
    run.completion?.inactivityTimeoutMs ?? null
  );

  const testsProgress = run.progress && getRunTestsProgress(run.progress);
  const ciData = getCiData({
    ciBuildId: runMeta?.ciBuildId,
    projectId: runMeta?.projectId,
  });

  return (
    <Card linkTo={linkToRun ? `/run/${runId}` : undefined}>
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
                <CiUrl {...ciData} disableLink={linkToRun} />
              </Grid>
            )}
            <Commit
              brief={brief}
              noLinks={linkToRun}
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
  runs: Array<Run>;
  linkToRun?: boolean;
};
type CiBuildSummaryComponent = FunctionComponent<CiBuildSummaryProps>;
