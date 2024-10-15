"use client"
// app/profile/page.tsx
import React from 'react';
import AdBanner from '@/components/AdBanner';
import Fnomodal from '@/components/FnoModal';
const fno = () => {
  return (
    <div>
      <Fnomodal/>
      <AdBanner
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
                dataAdSlot="6749622705"
              />
    </div>
  );
};

export default fno;
