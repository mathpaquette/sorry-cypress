import {
  Compress as CompressIcon,
  Loop as LoopIcon,
} from '@mui/icons-material';
import { Toolbar } from '@sorry-cypress/dashboard/components';
import { useAutoRefresh } from '@sorry-cypress/dashboard/hooks';
import {
  NavItemType,
  setNav,
} from '@sorry-cypress/dashboard/lib/navigation';
import React, { FunctionComponent, useLayoutEffect, useState } from 'react';
import {CiBuildsFeed} from "@sorry-cypress/dashboard/ciBuild/ciBuildsFeed/ciBuildsFeed";

export const CiBuildsView: CiBuildsViewComponent = (props) => {

  const [search, setSearch] = useState('');
  const [compactView, setCompactView] = useState(false);
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
            key: 'compactView',
            text: 'Compact view',
            showInMenuBreakpoint: ['xs'],
            icon: CompressIcon,
            toggleButton: true,
            selected: compactView,
            onClick: () => {
              setCompactView(!compactView);
            },
          },
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
        searchPlaceholder="Enter CI build id"
        onSearch={setSearch}
      />

      <CiBuildsFeed
          search={search}
          compact={compactView}
      />
    </>
  );
};

type CiBuildsViewProps = {};

type CiBuildsViewComponent = FunctionComponent<CiBuildsViewProps>;
