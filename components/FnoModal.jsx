import React, { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { Box } from '@mui/material';
import Papa from 'papaparse';
import dynamic from 'next/dynamic';
// Dynamically import ReactApexChart with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false
});
const Fnomodal = () => {
    const [chartData1, setChartData1] = useState([]);
    const [options1, setOptions1] = useState({});
    
    const [chartHeightmain, setChartHeightmain] = useState(0);
    const [chartWidthmain, setChartWidthmain] = useState(0);
    const prevChartDataRef = useRef(); // Ref to store previous chart data

    // Fetch data function
    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
          Authorization: 'Bearer r?!5-LAesZG0YwmYoK41alK?lClfpCS3tDj9AI620mvmn7Qua8Rr5BU7GQ36Or!YxOUQ8d!1FYh8U2-0EcY!tWJa2ICYf53b7uoD1xLvh89Jua!fUFXXq9OHaawdJfohSU7yPLzoAXFiLyPGyVueSg4DINzyiF-zShkEE7GrMIhKKz0sw?JNFFC2/0bDKN8MLar9r-vsog=J-wA9hJUxjw/BZUOz9UpN5oCG5pxdOgqPNFks!m/3=Vk=Kwmm1CGVW=YNggeTvZ/zxWP7?NEzv2Fu-UoJCWcldCHVpTfE-xZlzCJIh0!1TImHKyR7UuTJezTw5crjdxoB-b84rHZKTt-tCnY0D!qf0P64AekwL7UiuKslSKVZgXbl7WWNPpPmaI?RnmW0eZoXNkr-YUZDQlCLyrJ-G-aYCjtwVTPfHX4yi=n8zKVZjixCSwTM4wFkGbunTGIowVS8Ajywxg77E=0eHfgqp3/Pue0J!BWG3k9VVUjq0v4OzkMVvYjPoRH3WIgRqYPb=9fCEFkJbpMP=P6Hkpcb8?Nncdfaqj3!qM/0n=OhRhZ?IUb2x9cvz9e/=7vIV1Wkn=t!6-eXp9Yu?ZxC1JKDzUvXyuse6QpvBxnh9VcLfD8Sp9ia2QBRnfNfkb!OD2TlHxsYEQy3Meqjr4Sp/ey09w46-!wTp9XiV47UDM3Br/C4CFU?l59=fhgTl!mXq358tdMb!BbEknl2J5ArjBBO-aRWeKO9WirwBU4bRl4XAXN=lz6eZ=Ht3QMIRRoeNb4/!Rhu2?pmb1G6774rOf8aTxOiiXvOWWtf6u45uIQCf9uG-tyOY!fKsuHgNogNYCzhlvpFyFrK7Ic=-Q=0KZB6ksuxZE9jwN4wdGxvDfnDSl-yWdVk2a/aksN?461bzR3tQmBOeMg0?FmX3w=8f!K6LMB9H6c9WEHc86PManWF-hkEeHekXB7o0lh74F-d3ocC1W=vJ3cMrYGBgaoKRaL=XcQi/1r7oZIcFFnJ3d5QKk4V-aE0czh9wUYetFzwFEaR4061nb!uz5AHUkP78HEv8GCfjJFS4C/Ik!UA5WttBQBCVfT3miMKjO9T=UpJ3Oai3ALiW4QosXjC2BymX9lKg8/pMh1lcx1Q5yYG50G1FdAVPnKV83GMOIWbLhr533uCSWKlrzpOoVLIgHb7G3Ub?prvCPfGdzeFg639nHDQiD!W2TS7YvmUXZcTzQ-REwB6lmWqprDKTo1ZIYt1MCPPBdec!PSpJto8x6JAw!0cvd?9ewwhXHj-1?Bv8FhKC6cqr57Exo6CYAWYG9s6TzHd!1/1J1Tn3RFhSLilrFvihJEnPI28paJyVMemgPUEIf92ccsq9!!SpRZePy!l/YTHwzTvY7X1xeN6G1nU2kv=eTisiZR0vcCR=tbhHixjNtG/CB!SswSfVXzCtpen6bn/=Qv6qK=lsT5F9N6CEvlchCAg3p/b6dtYn=3?4ifW0M!MDwT=ZoQ/Vp6CtZal=3lypa485Wbv67zAlKXzcPDGPsa66PH9V05G=813zynlguQve1L-!maQRqO8VjQ!pOa5M1BYMDaQW/OZJ?dwYOEkrtYhS96U=pTrfC6nyunXK6kY/2hGdP?qtxtfqlw!KT5?gAUkF8PCrM01!AmESyM9994JbgMUI!BA6!nBe26ZPysM7E=DY9D85evY35l1PXpAMG7wJnSdj2Z!aWod81d=Ys=zl=I6hl-A!ziwI4ure!!I/2v0M9pLSA4=kMf2CpkHzs/XKCs6F7T4bAK-28XADBudCY6?!lW/7kQrVKQ1Od=aCh1lnBY3zEnxMxI1DMM4pGwZahvMW?UvEo8o-nc60O-7gQ?aO3iOhw6h7F/7ajfPjpv4P-n2spVaF!IVx=by2XrZyY98blM9DC5/ReQ8AhqQ?J9Yf2MxKhzEaDd2juivgdQ0mVJ!19S3ksUlmwsCrAzfdI!IGocClMDtuT2GhVv5D6hXmh9HqlA/tzriqHYFAqD!BnoVDXxScejauBivUKv7JTfAzyq8hHxPWN5l5kaAj/7nxWqsibJo',
                },
            };

            const response1 = await axios.get('https://main.tradifyapi.in/api/fno-data', config);
            const parseOptions = {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
            };
            const data2 = Papa.parse(response1.data, parseOptions).data;

            const processedData = data2.filter(item => !isNaN(parseFloat(item.pChange)));
            const top25 = processedData.sort((a, b) => parseFloat(b.pChange) - parseFloat(a.pChange)).slice(0, 20);
            const bottom25 = processedData.sort((a, b) => parseFloat(a.pChange) - parseFloat(b.pChange)).slice(0, 20);
            const combinedData = top25.concat(bottom25);
            const sortedCombinedData = combinedData.sort((a, b) => (b.IP * b.pChange) - (a.IP * a.pChange));

            const transformedData1 = sortedCombinedData.map((item) => ({
                x: item.symbol,
                y: parseFloat(item.pChange).toFixed(2),
                value: parseFloat(item.pChange) || 0,
                IP: isNaN(parseFloat(item.IP)) ? 0 : parseFloat(item.IP.toFixed(2)),
                z: item.Industry,
            }));

            // Update chart data if it's different from the previous data
            if (JSON.stringify(transformedData1) !== JSON.stringify(prevChartDataRef.current)) {
                setChartData1(transformedData1);
                prevChartDataRef.current = transformedData1; // Update ref
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(); // Initial data fetch
        const interval = setInterval(fetchData, 15000); // Fetch every 15 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (chartData1.length > 0) {
            setOptions1({
                legend: { show: false },
                chart: {
                    type: 'treemap',
                    toolbar: {
                        export: {
                            csv: { filename: "apexchart1" },
                            svg: { filename: "custom_name_svg" },
                            png: { filename: "custom_name_png" },
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#ffffff',
                        fontWeight: 'bolder',
                    },
                    formatter: (text, op) => [text, op.value.toFixed(2)],
                },
                tooltip: {
                    theme: 'dark',
                    y: {
                        formatter: value => value.toFixed(2),
                    },
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    },
                },
                plotOptions: {
                    treemap: {
                        enableShades: true,
                        shadeIntensity: 0.3,
                        reverseNegativeShade: true,
                        useFillColorAsStroke: true,
                        distributed: false,
                        borderRadius: 0,
                        colorScale: {
                            ranges: [
                                { from: -5, to: 0, color: '#bc0024' },
                                { from: 0, to: 5, color: '#32CD32' },
                            ],
                        },
                    },
                },
                series: [{ data: chartData1 }],
            });
        }
    }, [chartData1]);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                const windowHeight = window.innerHeight;
                const newChartHeight = windowHeight * 0.8; // 80% of the window height
                setChartHeightmain(newChartHeight);

                const windowWidth = window.innerWidth;
                const newChartWidth = windowWidth * 0.7; // 70% of the window width
                setChartWidthmain(newChartWidth);
            }
        };

        handleResize(); // Set initial size

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    return (
        <div className="h-screen w-screen dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative border-l-1.1 border-white">
            <div className="h-full flex justify-center items-center">
                <Grid justifyContent="center">
                    <Grid item xs={12} sm={12}>
                        <Box
                            bgcolor="#1c1c1c"
                            boxShadow={10}
                            style={{
                                marginTop: '30px',
                                borderRadius: '10px',
                                padding: '10px',
                                maxWidth: '800px',
                                margin: '0 auto',
                                borderLeft: '4px solid white',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h2 className="symbol-headingbig2" style={{ margin: '0 auto', fontSize: '1.5rem' }}>FNO Watchlist</h2>
                            </div>
                        </Box>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: chartHeightmain, marginTop: "30px" }}>
                            <ReactApexChart
                                options={options1}
                                series={[{ data: chartData1 }]}
                                type="treemap"
                                height={chartHeightmain}
                                width={chartWidthmain}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Fnomodal;
