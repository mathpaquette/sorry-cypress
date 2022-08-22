import { Loop as LoopIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { CiBuildsFeed } from '@sorry-cypress/dashboard/ciBuild/ciBuildsFeed';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import { NavItemType, setNav } from '@sorry-cypress/dashboard/lib/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { useAutoRefresh } from '../hooks';

export function CiBuildsView() {
  const [search, setSearch] = useState('');
  const [shouldAutoRefresh, setShouldAutoRefresh] = useAutoRefresh();

  useLayoutEffect(() => {
    setNav([
      {
        type: NavItemType.ciBuilds,
        label: 'CI Builds',
      },
    ]);
  }, []);

  return (
    <>
      <Toolbar
        actions={[
          {
            key: 'autoRefresh',
            text: 'Auto Refresh',
            icon: LoopIcon,
            toggleButton: true,
            selected: !!shouldAutoRefresh,
            onClick: () => {
              setShouldAutoRefresh(!shouldAutoRefresh);
              window.location.reload();
            },
          },
        ]}
        searchPlaceholder="Enter build id"
        onSearch={setSearch}
      />
      <Typography
        component="h1"
        variant="h6"
        color="text.primary"
        sx={{ mb: 5 }}
      >
        CI Builds
      </Typography>
      <CiBuildsFeed search={search}></CiBuildsFeed>
    </>
  );
}
