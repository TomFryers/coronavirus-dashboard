// @flow

import React, { useState } from 'react';
import type { ComponentType } from 'react';

import useLoadData from 'hooks/useLoadData';
import useResponsiveLayout from 'hooks/useResponsiveLayout';
import BigNumberBlock from 'components/BigNumberBlock';
import PageTitle from 'components/PageTitle';
import RegionTable from 'components/RegionTable';
import Map from 'components/Map';
import RegionTitle from 'components/RegionTitle';
import DailyConfirmedCases from 'components/DailyConfirmedCases';
import CumulativeTotalCases from 'components/CumulativeTotalCases';
import Disclaimer from 'components/Disclaimer';

import type { Props } from './Regional.types';
import * as Styles from './Regional.styles';

const LocalAuthorityal: ComponentType<Props> = ({}: Props) => {
  const [country, setCountry] = useState(null);
  const [nhsRegion, setNhsRegion] = useState(null);
  const [localAuthority, setLocalAuthority] = useState(null);
  const [overviewData, countryData, nhsRegionData, localAuthorityData] = useLoadData();
  const layout = useResponsiveLayout(768);

  if (!overviewData || !countryData || !nhsRegionData || !localAuthorityData) {
    return null;
  }

  const data = (() => {
    if (country) {
      return countryData?.[country];
    }
    if (nhsRegion) {
      return nhsRegionData?.[nhsRegion];
    }
    if (localAuthority) {
      return localAuthorityData?.[localAuthority];
    }
    return null;
  })();

  return (
    <Styles.Container className="govuk-width-container">
      <PageTitle
        caption="Regional view"
        title="Regional cases of coronavirus (COVID-19)"
        subtitle={`Last updated ${new Date(overviewData.lastUpdatedAt).toGMTString()}`}
      />
      <div />
      <RegionTitle region="United Kingdom" lastUpdatedAt="" />
      <BigNumberBlock data={overviewData?.['United Kingdom']} />
      <RegionTable
        country={country}
        setCountry={setCountry}
        countryData={countryData}
        nhsRegion={nhsRegion}
        setNhsRegion={setNhsRegion}
        nhsRegionData={nhsRegionData}
        localAuthority={localAuthority}
        setLocalAuthority={setLocalAuthority}
        localAuthorityData={localAuthorityData}
      />
      {layout === 'desktop' && (
        <Map
          country={country}
          setCountry={setCountry}
          countryData={countryData}
          nhsRegion={nhsRegion}
          setNhsRegion={setNhsRegion}
          nhsRegionData={nhsRegionData}
          localAuthority={localAuthority}
          setLocalAuthority={setLocalAuthority}
          localAuthorityData={localAuthorityData}
        />
      )}
      {data && layout === 'desktop' && (
        <>
          <RegionTitle region={localAuthority || country} lastUpdatedAt="" />
          <BigNumberBlock data={data} />
          <CumulativeTotalCases dailyData={data?.dailyConfirmedCases ?? []} />
          <DailyConfirmedCases region={localAuthority || country} data={data?.dailyConfirmedCases ?? []} />
        </>
      )}
      {layout === 'desktop' && <Disclaimer />}
    </Styles.Container>
  );
};

export default LocalAuthorityal;