import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

export default function LineChartOne({ name, fileName, seriesData }) {
  const mode = useSelector((state) => state.theme.theme);

  const options = {
    colors: ['#6284ff'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'line',
      height: 310,
      background: mode === 'dark' ? '#121212' : '#F4F4F5',
      toolbar: {
        show: true,
        export: {
          csv: { filename: `${fileName}Data` },
          svg: { filename: `${fileName}Chart` },
          png: { filename: `${fileName}Chart` },
        },
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
    },
    theme: {
      mode: mode === 'dark' ? 'dark' : 'light',
      palette: 'palette1',
      monochrome: {
        enabled: false,
        color: mode === 'dark' ? '#ffffff' : '#333333',
        shadeTo: mode === 'dark' ? 'dark' : 'light',
        shadeIntensity: 0.65,
      },
    },

    // plotOpions:

    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: seriesData?.x || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: mode === 'dark' ? '#fff' : '#787878',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      title: { text: undefined },
      labels: {
        style: {
          colors: mode === 'dark' ? '#fff' : '#787878',
          fontSize: '14px',
        },
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
      labels: {
        colors: mode === 'dark' ? '#fff' : '#000',
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
      borderColor: mode === 'dark' ? '#444' : '#ddd',
    },
    tooltip: {
      enabled: true,
      theme: mode === 'dark' ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
      },
      x: { show: false },
      y: {
        formatter: (val, { seriesIndex, dataPointIndex, w }) => {
          const prev =
            dataPointIndex > 0 ? w.config.series[seriesIndex].data[dataPointIndex - 1] : 0;
          const change = prev ? (((val - prev) / prev) * 100).toFixed(2) : 'N/A';
          return `${val}     (${change > 0 ? '+' : ''}${change}%)`;
        },
      },
      fillSeriesColor: false,
      marker: { show: false },
      onDatasetHover: { highlightDataSeries: true },
    },
  };

  return (
    <div className="max-w-full">
      <div
        className="w-full"
        style={{
          backgroundColor: mode === 'dark' ? '#121212' : '#F4F4F5',
          borderRadius: '10px',
          paddingInline: '10px',
          paddingTop: '10px',
        }}
      >
        <Chart
          options={options}
          series={[{ name: name, data: seriesData?.y || [] }]}
          type="line"
          width="100%"
          height="310"
        />
      </div>
    </div>
  );
}

LineChartOne.propTypes = {
  name: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  seriesData: PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.string).isRequired,
    y: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};
